import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleCode, User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export type CreateUserData = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone?.trim() || null,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /** Alias used by auth flows. */
  async findByIdOrFail(id: string): Promise<User> {
    return this.findByIdOrThrow(id);
  }

  async getRoleCodes(userId: string): Promise<RoleCode[]> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: { select: { code: true } } },
    });
    return rows.map((row) => row.role.code);
  }

  async assignRole(userId: string, roleCode: RoleCode): Promise<void> {
    const role = await this.prisma.role.findUnique({ where: { code: roleCode } });
    if (!role) {
      throw new NotFoundException(`Role ${roleCode} is not configured`);
    }

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: { userId, roleId: role.id },
      },
      update: {},
      create: {
        userId,
        roleId: role.id,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  toPublicUser(user: User, roles: RoleCode[] = []) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

    return {
      id: user.id,
      email: user.email,
      name: name || null,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      roles,
      createdAt: user.createdAt,
    };
  }
}
