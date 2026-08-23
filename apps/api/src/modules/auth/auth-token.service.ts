import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import type { AuthUserPayload } from '../../common/decorators/current-user.decorator';

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
};

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(payload: AuthUserPayload): string {
    return this.jwtService.sign(
      {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles ?? [],
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn: this.getExpiresIn('jwt.accessExpiresIn', '15m'),
      },
    );
  }

  signRefreshToken(payload: Pick<AuthUserPayload, 'sub'>): string {
    return this.jwtService.sign(
      {
        sub: payload.sub,
        jti: randomBytes(16).toString('hex'),
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.getExpiresIn('jwt.refreshExpiresIn', '7d'),
      },
    );
  }

  createTokenPair(payload: AuthUserPayload): TokenPair {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken({ sub: payload.sub });
    const refreshExpiresAt = this.resolveExpiryDate(
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d',
    );

    return { accessToken, refreshToken, refreshExpiresAt };
  }

  verifyAccessToken(token: string): AuthUserPayload {
    return this.jwtService.verify<AuthUserPayload>(token, {
      secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
    });
  }

  verifyRefreshToken(token: string): Pick<AuthUserPayload, 'sub'> {
    return this.jwtService.verify<{ sub: string }>(token, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
    });
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  generateOpaqueToken(): string {
    return randomBytes(32).toString('hex');
  }

  private getExpiresIn(key: string, fallback: StringValue): StringValue {
    return (this.configService.get<string>(key) ?? fallback) as StringValue;
  }

  private resolveExpiryDate(expiresIn: string): Date {
    const match = /^(\d+)([smhd])$/i.exec(expiresIn.trim());
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const unitMs: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + amount * (unitMs[unit] ?? unitMs.d));
  }
}
