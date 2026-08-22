import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppLoggerService } from '../common/logger/app-logger.service';

/**
 * Prisma database client wrapper.
 * Domain models are intentionally absent until the data-model phase.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: AppLoggerService) {
    super();
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to PostgreSQL');
    } catch (error) {
      // Allow process boot for foundation/Swagger; health endpoint reports DB status.
      this.logger.error(
        `Prisma connection failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.logger.warn(
        'API started without an active database connection. Start Postgres via docker compose.',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }
}
