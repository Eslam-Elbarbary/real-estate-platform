import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Permissions } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { UpdatePlatformSettingDto } from '../dto/update-platform-setting.dto';
import { AdminPlatformSettingDto } from '../mapper/platform-setting.mapper';
import { PlatformSettingsService } from '../platform-settings.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly platformSettingsService: PlatformSettingsService) {}

  @Get()
  @Permissions('settings.view')
  @ApiOperation({ summary: 'Get platform settings for admin management' })
  @ApiOkResponse({ type: AdminPlatformSettingDto })
  async getSettings(@Req() req: Request) {
    const data = await this.platformSettingsService.getAdmin();
    return buildSuccessResponse<AdminPlatformSettingDto>(data, 'OK', req.url);
  }

  @Patch()
  @Permissions('settings.update')
  @ApiOperation({ summary: 'Update platform settings' })
  @ApiOkResponse({ type: AdminPlatformSettingDto })
  updateSettings(
    @Body() dto: UpdatePlatformSettingDto,
  ): Promise<AdminPlatformSettingDto> {
    return this.platformSettingsService.update(dto);
  }
}
