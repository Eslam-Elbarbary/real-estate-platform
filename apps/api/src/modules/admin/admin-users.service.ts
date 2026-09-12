import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { UserRolesService } from '../permissions/user-roles.service';
import { ListAdminUsersQueryDto } from './dto/list-admin-users-query.dto';
import { AdminUserSelectQueryDto } from './dto/admin-user-select-query.dto';
import {
  AdminUserRoleDto,
  toAdminUserRole,
} from './mapper/admin-user-role.mapper';
import {
  ADMIN_USER_SELECT,
  ADMIN_USER_SELECT_FIELDS,
  AdminUserDetailsDto,
  AdminUserListItemDto,
  AdminUserSelectItemDto,
  SafeUserSelectRow,
  SafeUserWithRoles,
  toAdminUserDetails,
  toAdminUserListItem,
  toAdminUserSelectItem,
} from './mapper/admin-user.mapper';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRolesService: UserRolesService,
  ) {}

  async listUsers(query: ListAdminUsersQueryDto): Promise<{
    data: AdminUserListItemDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (query.status !== undefined) {
      where.isActive = query.status;
    }

    if (query.role) {
      where.roles = {
        some: {
          role: { code: query.role },
        },
      };
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: ADMIN_USER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) => toAdminUserListItem(row as SafeUserWithRoles)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getUserDetails(userId: string): Promise<AdminUserDetailsDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: ADMIN_USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toAdminUserDetails(user as SafeUserWithRoles);
  }

  async selectUsers(query: AdminUserSelectQueryDto): Promise<AdminUserSelectItemDto[]> {
    const limit = query.limit ?? 20;

    const where: Prisma.UserWhereInput = {
      isActive: true,
    };

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
      ];
    }

    const rows = await this.prisma.user.findMany({
      where,
      select: ADMIN_USER_SELECT_FIELDS,
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }, { email: 'asc' }],
      take: limit,
    });

    return rows.map((row) => toAdminUserSelectItem(row as SafeUserSelectRow));
  }

  async updateUserStatus(
    adminId: string,
    userId: string,
    isActive: boolean,
  ): Promise<AdminUserDetailsDto> {
    if (adminId === userId) {
      throw new BadRequestException('You cannot change your own account status');
    }

    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: ADMIN_USER_SELECT,
    });

    return toAdminUserDetails(user as SafeUserWithRoles);
  }

  async listUserRoles(userId: string): Promise<AdminUserRoleDto[]> {
    await this.assertUserExists(userId);
    const assignments = await this.userRolesService.getUserRoleAssignments(userId);
    return assignments.map(toAdminUserRole);
  }

  async assignUserRole(
    actorId: string,
    userId: string,
    roleCode: string,
  ): Promise<AdminUserRoleDto> {
    await this.assertUserExists(userId);

    const normalizedCode = roleCode.trim().toUpperCase();
    const role = await this.userRolesService.findRoleByCodeOrThrow(normalizedCode);

    if (role.isSuperAdmin) {
      await this.assertActorIsSuperAdmin(actorId);
    }

    const alreadyAssigned = await this.userRolesService.hasUserRole(userId, role.id);
    if (alreadyAssigned) {
      throw new ConflictException(`User already has role "${normalizedCode}"`);
    }

    const created = await this.prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
      select: {
        assignedAt: true,
        role: {
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            isSystem: true,
            isAdmin: true,
            isSuperAdmin: true,
            priority: true,
          },
        },
      },
    });

    return toAdminUserRole({
      ...created.role,
      assignedAt: created.assignedAt,
    });
  }

  async removeUserRole(
    actorId: string,
    userId: string,
    roleCode: string,
  ): Promise<AdminUserRoleDto> {
    await this.assertUserExists(userId);

    const normalizedCode = roleCode.trim().toUpperCase();
    const role = await this.userRolesService.findRoleByCodeOrThrow(normalizedCode);

    const assignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: { userId, roleId: role.id },
      },
      select: {
        assignedAt: true,
        role: {
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            isSystem: true,
            isAdmin: true,
            isSuperAdmin: true,
            priority: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`User does not have role "${normalizedCode}"`);
    }

    if (role.isSuperAdmin) {
      await this.assertActorIsSuperAdmin(actorId);

      if (actorId === userId) {
        throw new BadRequestException(
          'You cannot remove your own SUPER_ADMIN role',
        );
      }
    }

    if (role.isAdmin) {
      const adminRoleCount = await this.userRolesService.countAdminRolesForUser(userId);
      if (adminRoleCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the last admin role from a user',
        );
      }
    }

    const totalRoles = await this.userRolesService.countRolesForUser(userId);
    if (totalRoles <= 1) {
      throw new BadRequestException(
        role.isSystem
          ? 'Cannot remove the last system role assignment from a user'
          : 'User must retain at least one role',
      );
    }

    await this.prisma.userRole.delete({
      where: {
        userId_roleId: { userId, roleId: role.id },
      },
    });

    return toAdminUserRole({
      ...assignment.role,
      assignedAt: assignment.assignedAt,
    });
  }

  private async assertUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private async assertActorIsSuperAdmin(actorId: string): Promise<void> {
    const isSuperAdmin = await this.userRolesService.hasSuperAdminRole(actorId);
    if (!isSuperAdmin) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN users can manage SUPER_ADMIN role assignments',
      );
    }
  }
}
