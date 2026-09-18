import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Permissions } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { AdminCatalogsService } from '../admin-catalogs.service';
import { CreateAdminFeatureDto } from '../dto/create-admin-feature.dto';
import { ListAdminFeaturesQueryDto } from '../dto/list-admin-catalogs-query.dto';
import { UpdateAdminFeatureDto } from '../dto/update-admin-feature.dto';
import { AdminFeatureDto } from '../mapper/admin-catalog.mapper';

/**
 * Dedicated admin features routes (aliases catalogs/features).
 * Accepts features.* or catalogs.* permissions.
 */
@ApiTags('Admin Features')
@ApiBearerAuth()
@Controller('admin/features')
export class AdminFeaturesController {
  constructor(private readonly adminCatalogsService: AdminCatalogsService) {}

  @Get()
  @Permissions('features.view', 'catalogs.view')
  @ApiOperation({ summary: 'List all features (including inactive)' })
  @ApiOkResponse({ type: AdminFeatureDto, isArray: true })
  async list(
    @Query() query: ListAdminFeaturesQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminCatalogsService.listFeatures(query);
    return buildSuccessResponse<AdminFeatureDto[]>(data, 'OK', req.url);
  }

  @Post()
  @Permissions('features.create', 'catalogs.create')
  @ApiOperation({ summary: 'Create a feature' })
  @ApiCreatedResponse({ type: AdminFeatureDto })
  create(@Body() dto: CreateAdminFeatureDto): Promise<AdminFeatureDto> {
    return this.adminCatalogsService.createFeature(dto);
  }

  @Patch(':id')
  @Permissions('features.update', 'catalogs.update')
  @ApiOperation({ summary: 'Update a feature' })
  @ApiOkResponse({ type: AdminFeatureDto })
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminFeatureDto,
  ): Promise<AdminFeatureDto> {
    return this.adminCatalogsService.updateFeature(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('features.delete', 'catalogs.update')
  @ApiOperation({
    summary:
      'Delete a feature (hard-delete if unused; otherwise deactivate)',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        deleted: { type: 'boolean' },
      },
    },
  })
  delete(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.adminCatalogsService.deleteFeature(id).then((data) =>
      buildSuccessResponse(data, 'OK', req.url),
    );
  }
}
