import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export type UserRoleMetadata = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  priority: number;
};

export type UserRoleAssignment = UserRoleMetadata & {
  assignedAt: Date;
};

const ROLE_METADATA_SELECT = {
  id: true,
  code: true,
  name: true,
  description: true,
  isSystem: true,
  isAdmin: true,
  isSuperAdmin: true,
  priority: true,
} as const;

@Injectable()
export class UserRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRolesWithMetadata(userId: string): Promise<UserRoleMetadata[]> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      select: { role: { select: ROLE_METADATA_SELECT } },
    });

    return rows.map(({ role }) => role);
  }

  async getUserRoleAssignments(userId: string): Promise<UserRoleAssignment[]> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      select: {
        assignedAt: true,
        role: { select: ROLE_METADATA_SELECT },
      },
      orderBy: [{ role: { priority: 'desc' } }, { role: { code: 'asc' } }],
    });

    return rows.map(({ assignedAt, role }) => ({
      ...role,
      assignedAt,
    }));
  }

  async getUserRoleCodes(userId: string): Promise<string[]> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      select: { role: { select: { code: true } } },
    });

    return rows.map((row) => row.role.code);
  }

  async hasAdminRole(userId: string): Promise<boolean> {
    const match = await this.prisma.userRole.findFirst({
      where: {
        userId,
        role: { isAdmin: true },
      },
      select: { userId: true },
    });

    return match !== null;
  }

  async hasSuperAdminRole(userId: string): Promise<boolean> {
    const match = await this.prisma.userRole.findFirst({
      where: {
        userId,
        role: { isSuperAdmin: true },
      },
      select: { userId: true },
    });

    return match !== null;
  }

  async findRoleIdByCode(roleCode: string): Promise<string | null> {
    const role = await this.prisma.role.findUnique({
      where: { code: roleCode },
      select: { id: true },
    });

    return role?.id ?? null;
  }

  async findRoleByCode(roleCode: string): Promise<UserRoleMetadata | null> {
    return this.prisma.role.findUnique({
      where: { code: roleCode },
      select: ROLE_METADATA_SELECT,
    });
  }

  async findRoleByCodeOrThrow(roleCode: string): Promise<UserRoleMetadata> {
    const role = await this.findRoleByCode(roleCode);
    if (!role) {
      throw new NotFoundException(`Role ${roleCode} is not configured`);
    }
    return role;
  }

  async countAdminRolesForUser(userId: string): Promise<number> {
    return this.prisma.userRole.count({
      where: {
        userId,
        role: { isAdmin: true },
      },
    });
  }

  async countRolesForUser(userId: string): Promise<number> {
    return this.prisma.userRole.count({ where: { userId } });
  }

  async hasUserRole(userId: string, roleId: string): Promise<boolean> {
    const match = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
      select: { userId: true },
    });
    return match !== null;
  }
}
