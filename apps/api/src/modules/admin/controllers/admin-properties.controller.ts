import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser, Roles } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { AdminPropertiesService } from '../admin-properties.service';
import { ListAdminPropertiesQueryDto } from '../dto/list-admin-properties-query.dto';
import { RejectPropertyDto } from '../dto/reject-property.dto';
import {
  AdminPropertyReviewCardDto,
  AdminPropertyReviewDetailsDto,
} from '../mapper/admin-property.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/properties')
@Roles(RoleCode.ADMIN, RoleCode.MODERATOR)
export class AdminPropertiesController {
  constructor(private readonly adminPropertiesService: AdminPropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'List properties for moderation review' })
  async listProperties(@Query() query: ListAdminPropertiesQueryDto, @Req() req: Request) {
    const result = await this.adminPropertiesService.listProperties(query);
    return buildSuccessResponse<AdminPropertyReviewCardDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property review details' })
  getPropertyDetails(@Param('id') id: string): Promise<AdminPropertyReviewDetailsDto> {
    return this.adminPropertiesService.getPropertyDetails(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a pending review property' })
  approveProperty(
    @CurrentUser() user: AuthUserPayload,
    @Param('id') id: string,
  ) {
    return this.adminPropertiesService.approveProperty(user.sub, id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a pending review property' })
  rejectProperty(
    @CurrentUser() user: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: RejectPropertyDto,
  ) {
    return this.adminPropertiesService.rejectProperty(user.sub, id, dto.reason);
  }

  @Post(':id/archive')
  @Roles(RoleCode.ADMIN)
  @ApiOperation({ summary: 'Archive a property (admin only)' })
  archiveProperty(@CurrentUser() user: AuthUserPayload, @Param('id') id: string) {
    return this.adminPropertiesService.archiveProperty(user.sub, id);
  }
}
