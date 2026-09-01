import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser, Roles } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { AdminPropertiesService } from '../admin-properties.service';
import { AdminPropertyManagementService } from '../admin-property-management.service';
import { CreateAdminPropertyDto } from '../dto/create-admin-property.dto';
import { ListAdminPropertiesQueryDto } from '../dto/list-admin-properties-query.dto';
import { RejectPropertyDto } from '../dto/reject-property.dto';
import { UpdateAdminPropertyDto } from '../dto/update-admin-property.dto';
import {
  AdminPropertyReviewCardDto,
  AdminPropertyReviewDetailsDto,
} from '../mapper/admin-property.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/properties')
@Roles(RoleCode.ADMIN, RoleCode.MODERATOR)
export class AdminPropertiesController {
  constructor(
    private readonly adminPropertiesService: AdminPropertiesService,
    private readonly adminPropertyManagementService: AdminPropertyManagementService,
  ) {}

  @Post()
  @Roles(RoleCode.ADMIN)
  @ApiOperation({ summary: 'Create a property (admin management)' })
  @ApiCreatedResponse({ type: AdminPropertyReviewDetailsDto })
  createProperty(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateAdminPropertyDto,
  ): Promise<AdminPropertyReviewDetailsDto> {
    return this.adminPropertyManagementService.createProperty(user.sub, dto);
  }

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

  @Patch(':id')
  @Roles(RoleCode.ADMIN)
  @ApiOperation({ summary: 'Update a property (admin management)' })
  @ApiOkResponse({ type: AdminPropertyReviewDetailsDto })
  updateProperty(
    @CurrentUser() user: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAdminPropertyDto,
  ): Promise<AdminPropertyReviewDetailsDto> {
    return this.adminPropertyManagementService.updateProperty(user.sub, id, dto);
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
