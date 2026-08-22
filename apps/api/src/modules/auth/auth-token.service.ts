import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import type { AuthUserPayload } from '../../common/decorators/current-user.decorator';

/**
 * Token helpers for the upcoming auth module.
 * No login/register business logic here yet.
 */
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
      { sub: payload.sub },
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.getExpiresIn('jwt.refreshExpiresIn', '7d'),
      },
    );
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

  private getExpiresIn(key: string, fallback: StringValue): StringValue {
    return (this.configService.get<string>(key) ?? fallback) as StringValue;
  }
}
