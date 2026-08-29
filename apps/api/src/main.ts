import 'reflect-metadata';
import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppLoggerService } from './common/logger/app-logger.service';
import { createGlobalValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = await app.resolve(AppLoggerService);
  logger.setContext('Bootstrap');
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 4000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string[]>('app.corsOrigin', [
    'http://localhost:3000',
  ]);
  const swaggerEnabled = configService.get<boolean>('app.swaggerEnabled', true);
  const swaggerPath = configService.get<string>('app.swaggerPath', 'docs');

  app.setGlobalPrefix(apiPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.useGlobalPipes(createGlobalValidationPipe());

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Aqarmap API')
      .setDescription(
        'Real estate marketplace backend API — properties, subscriptions, payments, leads, and admin tools.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token',
        },
        'access-token',
      )
      .addTag('health', 'Service health')
      .addTag('auth', 'Authentication')
      .addTag('users', 'User profile')
      .addTag('properties', 'Property listings')
      .addTag('plans', 'Listing plans')
      .addTag('subscriptions', 'Property subscriptions')
      .addTag('payments', 'Subscription payments')
      .addTag('leads', 'Buyer inquiries')
      .addTag('notifications', 'User notifications')
      .addTag('alerts', 'Saved search alerts')
      .addTag('catalogs', 'Property creation catalogs')
      .addTag('Admin', 'Administrator operations')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`Swagger docs available at /${swaggerPath}`);
  }

  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}/${apiPrefix}`);
  logger.log(`Health check at http://localhost:${port}/health`);
}

void bootstrap();
