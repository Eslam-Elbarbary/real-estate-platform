import { Module } from '@nestjs/common';
import { AdminSettingsController } from './controllers/admin-settings.controller';
import { SettingsController } from './controllers/settings.controller';
import { PlatformSettingsService } from './platform-settings.service';

@Module({
  controllers: [SettingsController, AdminSettingsController],
  providers: [PlatformSettingsService],
  exports: [PlatformSettingsService],
})
export class SettingsModule {}
