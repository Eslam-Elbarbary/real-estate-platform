import { Module } from '@nestjs/common';
import { CompoundsController } from './compounds.controller';
import { CompoundsService } from './compounds.service';

@Module({
  controllers: [CompoundsController],
  providers: [CompoundsService],
  exports: [CompoundsService],
})
export class CompoundsModule {}
