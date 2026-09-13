import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerificationTokenType } from '@/prisma/generated/prisma-client';
import * as bcrypt from 'bcrypt';
import { AppLoggerService } from '../../common/logger/app-logger.service';
import { PrismaService } from '../../database/prisma.service';
import { UserPermissionsService } from '../permissions/user-permissions.service';
import { UsersService } from '../users/users.service';
import { AuthTokenService } from './auth-token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const BCRYPT_ROUNDS = 12;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export type RequestMeta = {
  userAgent?: string;
  ipAddress?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: AuthTokenService,
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
    private readonly configService: ConfigService,
    private readonly userPermissionsService: UserPermissionsService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });

    await this.usersService.assignRole(user.id, 'USER');
    const verificationToken = await this.createVerificationToken(
      user.id,
      VerificationTokenType.EMAIL_VERIFICATION,
      EMAIL_VERIFICATION_TTL_MS,
    );

    const roles = await this.usersService.getRoleCodes(user.id);
    this.logger.log(`Registered user ${user.id}`);

    const response: {
      user: ReturnType<UsersService['toPublicUser']>;
      message: string;
      verificationToken?: string;
    } = {
      user: this.usersService.toPublicUser(user, roles),
      message: 'Registration successful. Please verify your email.',
    };

    if (!this.isProductionEnvironment()) {
      response.verificationToken = verificationToken;
    }

    return response;
  }

  async login(dto: LoginDto, meta: RequestMeta = {}) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const roles = await this.usersService.getRoleCodes(user.id);
    const tokens = await this.issueSession(user.id, user.email, roles, meta);

    return {
      ...tokens,
      user: this.usersService.toPublicUser(user, roles),
    };
  }

  async verifyEmail(token: string) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      !record ||
      record.type !== VerificationTokenType.EMAIL_VERIFICATION ||
      record.usedAt ||
      record.expiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { isEmailVerified: true },
      }),
      this.prisma.verificationToken.delete({ where: { id: record.id } }),
    ]);

    return { message: 'Email verified successfully' };
  }

  async refresh(refreshToken: string, meta: RequestMeta = {}) {
    let payload: { sub: string };
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = this.tokenService.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !stored ||
      stored.userId !== payload.sub ||
      stored.revokedAt ||
      stored.expiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const roles = await this.usersService.getRoleCodes(user.id);
    const tokens = await this.issueSession(user.id, user.email, roles, meta);
    const permissions = await this.userPermissionsService.getPermissionCodesForUser(
      user.id,
    );

    return {
      ...tokens,
      user: {
        ...this.usersService.toPublicUser(user, roles),
        permissions: [...permissions].sort(),
      },
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.tokenService.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (stored && !stored.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });
    }

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const generic = {
      message:
        'If an account exists for this email, password reset instructions have been sent.',
    };

    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      return generic;
    }

    await this.prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: VerificationTokenType.PASSWORD_RESET,
      },
    });

    await this.createVerificationToken(
      user.id,
      VerificationTokenType.PASSWORD_RESET,
      PASSWORD_RESET_TTL_MS,
    );

    this.logger.log(`Password reset token created for user ${user.id}`);
    return generic;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token: dto.token },
    });

    if (
      !record ||
      record.type !== VerificationTokenType.PASSWORD_RESET ||
      record.usedAt ||
      record.expiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.verificationToken.delete({ where: { id: record.id } }),
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  async me(userId: string) {
    const user = await this.usersService.findByIdOrThrow(userId);
    const roles = await this.usersService.getRoleCodes(user.id);
    const publicUser = this.usersService.toPublicUser(user, roles);

    return {
      id: publicUser.id,
      email: publicUser.email,
      name: publicUser.name,
      phone: publicUser.phone,
      roles: publicUser.roles,
    };
  }

  private async issueSession(
    userId: string,
    email: string,
    roles: string[],
    meta: RequestMeta,
  ) {
    const pair = this.tokenService.createTokenPair({
      sub: userId,
      email,
      roles,
    });

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.tokenService.hashToken(pair.refreshToken),
        expiresAt: pair.refreshExpiresAt,
        userAgent: meta.userAgent ?? null,
        ipAddress: meta.ipAddress ?? null,
      },
    });

    return {
      accessToken: pair.accessToken,
      refreshToken: pair.refreshToken,
      tokenType: 'Bearer' as const,
      expiresIn: this.configServiceAccessLabel(),
    };
  }

  private async createVerificationToken(
    userId: string,
    type: VerificationTokenType,
    ttlMs: number,
  ): Promise<string> {
    await this.prisma.verificationToken.deleteMany({
      where: { userId, type },
    });

    const token = this.tokenService.generateOpaqueToken();
    await this.prisma.verificationToken.create({
      data: {
        userId,
        token,
        type,
        expiresAt: new Date(Date.now() + ttlMs),
      },
    });
    return token;
  }

  private isProductionEnvironment(): boolean {
    return this.configService.get<string>('app.appEnv', 'development') === 'production';
  }

  private configServiceAccessLabel(): string {
    return '15m';
  }
}
