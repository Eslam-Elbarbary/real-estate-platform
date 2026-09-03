import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ListRolesQueryDto } from './dto/list-roles-query.dto';
import { SetRolePermissionsDto } from './dto/set-role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  AdminRoleDetailsDto,
  AdminRoleListItemDto,
  toAdminRoleDetails,
  toAdminRoleListItem,
} from './mapper/role.mapper';
import { isValidRoleCodeFormat } from './role-code.util';

const ROLE_LIST_INCLUDE = {
  _count: {
    select: {
      users: true,
      permissions: true,
    },
  },
} satisfies Prisma.RoleInclude;

const ROLE_DETAILS_INCLUDE = {
  permissions: {
    select: {
      permission: {
        select: { code: true },
      },
    },
  },
  _count: {
    select: {
      users: true,
      permissions: true,
    },
  },
} satisfies Prisma.RoleInclude;

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async listAdmin(query: ListRolesQueryDto): Promise<{
    data: AdminRoleListItemDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildSearchWhere(query.search);

    const [total, rows] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        include: ROLE_LIST_INCLUDE,
        orderBy: [{ priority: 'desc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(toAdminRoleListItem),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getAdminById(id: string): Promise<AdminRoleDetailsDto> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: ROLE_DETAILS_INCLUDE,
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return toAdminRoleDetails(role);
  }

  async createAdmin(dto: CreateRoleDto): Promise<AdminRoleDetailsDto> {
    this.assertRoleCodeFormat(dto.code);

    const existing = await this.prisma.role.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Role with code "${dto.code}" already exists`);
    }

    const role = await this.prisma.role.create({
      data: {
        code: dto.code,
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        isSystem: false,
        isAdmin: dto.isAdmin ?? false,
        isSuperAdmin: dto.isSuperAdmin ?? false,
        priority: dto.priority ?? 0,
      },
      include: ROLE_DETAILS_INCLUDE,
    });

    return toAdminRoleDetails(role);
  }

  async updateAdmin(id: string, dto: UpdateRoleDto): Promise<AdminRoleDetailsDto> {
    const role = await this.findRoleOrThrow(id);

    const data: Prisma.RoleUpdateInput = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.description !== undefined) {
      data.description = dto.description.trim() || null;
    }
    if (dto.priority !== undefined) {
      data.priority = dto.priority;
    }

    if (role.isSystem) {
      if (dto.isAdmin !== undefined || dto.isSuperAdmin !== undefined) {
        throw new BadRequestException(
          'System role admin flags cannot be changed via the API',
        );
      }
    } else {
      if (dto.isAdmin !== undefined) {
        data.isAdmin = dto.isAdmin;
      }
      if (dto.isSuperAdmin !== undefined) {
        data.isSuperAdmin = dto.isSuperAdmin;
      }
    }

    if (Object.keys(data).length === 0) {
      return this.getAdminById(id);
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data,
      include: ROLE_DETAILS_INCLUDE,
    });

    return toAdminRoleDetails(updated);
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    const role = await this.findRoleOrThrow(id);

    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    const userCount = await this.prisma.userRole.count({
      where: { roleId: id },
    });

    if (userCount > 0) {
      throw new BadRequestException(
        'Role cannot be deleted while it is assigned to users',
      );
    }

    await this.prisma.role.delete({ where: { id } });

    return { message: 'Role deleted successfully' };
  }

  async setPermissions(
    id: string,
    dto: SetRolePermissionsDto,
  ): Promise<AdminRoleDetailsDto> {
    await this.findRoleOrThrow(id);

    const uniqueCodes = [...new Set(dto.permissionCodes.map((code) => code.trim()))];
    const permissions = await this.prisma.permission.findMany({
      where: { code: { in: uniqueCodes } },
      select: { id: true, code: true },
    });

    if (permissions.length !== uniqueCodes.length) {
      const found = new Set(permissions.map((permission) => permission.code));
      const missing = uniqueCodes.filter((code) => !found.has(code));
      throw new BadRequestException(
        `Unknown permission codes: ${missing.join(', ')}`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId: id } });

      if (permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((permission) => ({
            roleId: id,
            permissionId: permission.id,
          })),
        });
      }
    });

    return this.getAdminById(id);
  }

  private async findRoleOrThrow(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  private assertRoleCodeFormat(code: string): void {
    if (!isValidRoleCodeFormat(code)) {
      throw new BadRequestException(
        'Role code must contain only uppercase letters, numbers, and underscores',
      );
    }
  }

  private buildSearchWhere(search?: string): Prisma.RoleWhereInput {
    const term = search?.trim();
    if (!term) {
      return {};
    }

    return {
      OR: [
        { code: { equals: term.toUpperCase() } },
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ],
    };
  }
}
