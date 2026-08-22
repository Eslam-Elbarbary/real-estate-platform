import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { AuthTokenService } from './auth-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn = (configService.get<string>('jwt.accessExpiresIn') ??
          '15m') as StringValue;

        return {
          secret: configService.getOrThrow<string>('jwt.accessSecret'),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [JwtStrategy, AuthTokenService],
  exports: [JwtModule, PassportModule, AuthTokenService],
})
export class AuthModule {}
