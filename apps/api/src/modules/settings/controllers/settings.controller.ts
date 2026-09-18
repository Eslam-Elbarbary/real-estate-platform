import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators';
import { PublicPlatformSettingDto } from '../mapper/platform-setting.mapper';
import { PlatformSettingsService } from '../platform-settings.service';

@ApiTags('settings')
@Public()
@Controller('settings')
export class SettingsController {
  constructor(private readonly platformSettingsService: PlatformSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get public platform settings (branding, contact, SEO)' })
  @ApiOkResponse({ type: PublicPlatformSettingDto })
  getPublicSettings(): Promise<PublicPlatformSettingDto> {
    return this.platformSettingsService.getPublic();
  }
}
