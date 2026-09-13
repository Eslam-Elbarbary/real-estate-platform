import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@/prisma/generated/prisma-client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { MediaService } from '../media/media.service';
import { UserRolesService } from '../permissions/user-roles.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

export type CreateUserData = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type ProfileResponse = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: string[];
  isEmailVerified: boolean;
};

const BCRYPT_ROUNDS = 12;
const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly userRolesService: UserRolesService,
  ) {}

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

  async findByIdOrFail(id: string): Promise<User> {
    return this.findByIdOrThrow(id);
  }

  /** @deprecated Prefer UserRolesService.getUserRoleCodes */
  async getRoleCodes(userId: string): Promise<string[]> {
    return this.userRolesService.getUserRoleCodes(userId);
  }

  async assignRole(userId: string, roleCode: string): Promise<void> {
    const roleId = await this.userRolesService.findRoleIdByCode(roleCode);
    if (!roleId) {
      throw new NotFoundException(`Role ${roleCode} is not configured`);
    }

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: { userId, roleId },
      },
      update: {},
      create: {
        userId,
        roleId,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.findByIdOrThrow(userId);
    const roles = await this.getRoleCodes(user.id);
    return this.toProfile(user, roles);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponse> {
    const data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
    } = {};

    if (dto.firstName !== undefined) {
      data.firstName = dto.firstName.trim();
    }
    if (dto.lastName !== undefined) {
      data.lastName = dto.lastName.trim();
    }
    if (dto.phone !== undefined) {
      data.phone = dto.phone.trim() || null;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    const roles = await this.getRoleCodes(user.id);
    return this.toProfile(user, roles);
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File | undefined,
  ): Promise<ProfileResponse> {
    this.assertValidAvatarFile(file);

    const user = await this.findByIdOrThrow(userId);

    if (user.avatarPublicId) {
      try {
        await this.mediaService.delete({
          publicId: user.avatarPublicId,
          resourceType: 'image',
        });
      } catch {
        // Continue with upload even if old asset cleanup fails.
      }
    }

    const uploaded = await this.mediaService.upload({
      buffer: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
      folder: 'aqarmap/avatars',
      resourceType: 'image',
      tags: ['avatar', userId],
    });

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: uploaded.secureUrl,
        avatarPublicId: uploaded.publicId,
      },
    });

    const roles = await this.getRoleCodes(updated.id);
    return this.toProfile(updated, roles);
  }

  async deleteAvatar(userId: string): Promise<ProfileResponse> {
    const user = await this.findByIdOrThrow(userId);

    if (user.avatarPublicId) {
      await this.mediaService.delete({
        publicId: user.avatarPublicId,
        resourceType: 'image',
      });
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: null,
        avatarPublicId: null,
      },
    });

    const roles = await this.getRoleCodes(updated.id);
    return this.toProfile(updated, roles);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.findByIdOrThrow(userId);

    const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password changed successfully. Please sign in again.' };
  }

  toPublicUser(user: User, roles: string[] = []) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

    return {
      id: user.id,
      email: user.email,
      name: name || null,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      roles,
      createdAt: user.createdAt,
    };
  }

  toProfile(user: User, roles: string[]): ProfileResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      roles,
      isEmailVerified: user.isEmailVerified,
    };
  }

  private assertValidAvatarFile(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    if (!AVATAR_ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(
        'Invalid avatar type. Allowed: JPEG, PNG, WebP',
      );
    }

    if (file.size <= 0 || file.size > AVATAR_MAX_BYTES) {
      throw new BadRequestException('Avatar must be between 1 byte and 5MB');
    }

    if (!file.buffer?.length) {
      throw new BadRequestException('Avatar file is empty');
    }
  }
}
