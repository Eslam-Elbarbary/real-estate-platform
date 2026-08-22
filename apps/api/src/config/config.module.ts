import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import cloudinaryConfig from './cloudinary.config';
import { validateEnv } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env', 'apps/api/.env'],
      load: [appConfig, databaseConfig, jwtConfig, cloudinaryConfig],
      validate: validateEnv,
    }),
  ],
})
export class AppConfigModule {}
