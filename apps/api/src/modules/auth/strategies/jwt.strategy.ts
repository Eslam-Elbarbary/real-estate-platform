import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.usersService.findById(payload.sub); // fresh DB lookup
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid access token');
    }

    const roles = await this.usersService.getRoleCodes(user.id);

    return {
      sub: user.id,
      email: user.email,
      roles,
    };
  }
}
