import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ListAdminUsersQueryDto } from './dto/list-admin-users-query.dto';
import { AdminUserSelectQueryDto } from './dto/admin-user-select-query.dto';
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
  constructor(private readonly prisma: PrismaService) {}

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
}
