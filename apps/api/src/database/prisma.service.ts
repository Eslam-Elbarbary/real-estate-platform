import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/prisma/generated/prisma-client';
import { AppLoggerService } from '../common/logger/app-logger.service';

/**
 * Build a node-postgres Pool + PrismaPg adapter from DATABASE_URL.
 *
 * Prisma's `?schema=` query param is ORM-specific. With the Prisma 7 driver
 * adapter it must be passed explicitly to PrismaPg; leaving it only in the URL
 * is unreliable. Unknown URL params can also confuse `pg`.
 */
function createPrismaPgAdapter(connectionString: string): {
  adapter: PrismaPg;
  pool: Pool;
} {
  const url = new URL(connectionString);
  const schema = url.searchParams.get('schema')?.trim() || 'public';

  // node-postgres does not understand Prisma's schema query param.
  url.searchParams.delete('schema');

  const pool = new Pool({ connectionString: url.toString() });
  const adapter = new PrismaPg(pool, { schema });

  return { adapter, pool };
}

/**
 * Prisma database client wrapper (Prisma 7 + @prisma/adapter-pg).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(private readonly logger: AppLoggerService) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Configure apps/api/.env before starting the API.',
      );
    }

    const { adapter, pool } = createPrismaPgAdapter(connectionString);
    super({ adapter });
    this.pool = pool;
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      // Driver adapters may treat $connect as a no-op; verify with a real query.
      await this.$queryRaw`SELECT 1`;
      this.logger.log('Prisma connected to PostgreSQL');
    } catch (error) {
      const detail =
        error instanceof Error
          ? `${error.name}${'code' in error ? ` [${String((error as { code?: unknown }).code)}]` : ''}: ${error.message}`
          : String(error);

      this.logger.error(`Prisma connection failed: ${detail}`);
      this.logger.warn(
        'API started without an active database connection. Start Postgres (e.g. docker compose up -d in apps/api) and ensure DATABASE_URL points at it.',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Prisma disconnected');
  }
}
