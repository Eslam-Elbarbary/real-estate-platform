import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserPayload } from '../../../common/decorators/current-user.decorator';
import { UsersService } from '../../users/users.service';

type JwtPayload = {
  sub: string;
  email?: string;
  roles?: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUserPayload> {
    if (!payload?.sub) {
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn('JWT rejected — missing subject claim');
      }
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn(
          `JWT rejected — user=${payload.sub} exists=${Boolean(user)} active=${user?.isActive ?? false}`,
        );
      }
      throw new UnauthorizedException('Invalid access token');
    }

    const roles = await this.usersService.getRoleCodes(user.id);

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`JWT validated user=${user.id} roles=[${roles.join(', ')}]`);
    }

    return {
      sub: user.id,
      email: user.email,
      roles,
    };
  }
}
