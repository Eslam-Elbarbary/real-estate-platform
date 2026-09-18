import { Module } from '@nestjs/common';
import { AdminBannersController } from './controllers/admin-banners.controller';
import { BannersController } from './controllers/banners.controller';
import { BannersService } from './banners.service';

@Module({
  controllers: [BannersController, AdminBannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
