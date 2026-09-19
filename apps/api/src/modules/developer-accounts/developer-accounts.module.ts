import { Module } from '@nestjs/common';
import { DeveloperAccountsController } from './developer-accounts.controller';
import { DeveloperAccountsService } from './developer-accounts.service';

@Module({
  controllers: [DeveloperAccountsController],
  providers: [DeveloperAccountsService],
  exports: [DeveloperAccountsService],
})
export class DeveloperAccountsModule {}
