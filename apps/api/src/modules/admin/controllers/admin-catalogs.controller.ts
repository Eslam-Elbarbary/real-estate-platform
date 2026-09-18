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
import { CreateAdminPropertyTypeDto } from '../dto/create-admin-property-type.dto';
import { CreateAdminPropertyLegalStatusDto } from '../dto/create-admin-property-legal-status.dto';
import { CreateAdminPropertyViewDto } from '../dto/create-admin-property-view.dto';
import { CreateAdminTransactionTypeDto } from '../dto/create-admin-transaction-type.dto';
import {
  ListAdminCatalogsQueryDto,
  ListAdminFeaturesQueryDto,
} from '../dto/list-admin-catalogs-query.dto';
import { UpdateAdminFeatureDto } from '../dto/update-admin-feature.dto';
import { UpdateAdminPropertyLegalStatusDto } from '../dto/update-admin-property-legal-status.dto';
import { UpdateAdminPropertyTypeDto } from '../dto/update-admin-property-type.dto';
import { UpdateAdminPropertyViewDto } from '../dto/update-admin-property-view.dto';
import { UpdateAdminTransactionTypeDto } from '../dto/update-admin-transaction-type.dto';
import {
  AdminFeatureDto,
  AdminFinishingTypeDto,
  AdminPropertyLegalStatusDto,
  AdminPropertyTypeDto,
  AdminPropertyViewDto,
  AdminTransactionTypeDto,
} from '../mapper/admin-catalog.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/catalogs')
export class AdminCatalogsController {
  constructor(private readonly adminCatalogsService: AdminCatalogsService) {}

  // ── Property types ────────────────────────────────────────────────────────

  @Get('property-types')
  @Permissions('catalogs.view')
  @ApiOperation({ summary: 'List all property types (including inactive)' })
  @ApiOkResponse({ type: AdminPropertyTypeDto, isArray: true })
  async listPropertyTypes(
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminCatalogsService.listPropertyTypes(query);
    return buildSuccessResponse<AdminPropertyTypeDto[]>(data, 'OK', req.url);
  }

  @Post('property-types')
  @Permissions('catalogs.create')
  @ApiOperation({ summary: 'Create a property type' })
  @ApiCreatedResponse({ type: AdminPropertyTypeDto })
  createPropertyType(
    @Body() dto: CreateAdminPropertyTypeDto,
  ): Promise<AdminPropertyTypeDto> {
    return this.adminCatalogsService.createPropertyType(dto);
  }

  @Patch('property-types/:id')
  @Permissions('catalogs.update')
  @ApiOperation({ summary: 'Update a property type' })
  @ApiOkResponse({ type: AdminPropertyTypeDto })
  updatePropertyType(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminPropertyTypeDto,
  ): Promise<AdminPropertyTypeDto> {
    return this.adminCatalogsService.updatePropertyType(id, dto);
  }

  // ── Transaction types ─────────────────────────────────────────────────────

  @Get('transaction-types')
  @Permissions('catalogs.view')
  @ApiOperation({ summary: 'List all transaction types (including inactive)' })
  @ApiOkResponse({ type: AdminTransactionTypeDto, isArray: true })
  async listTransactionTypes(
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminCatalogsService.listTransactionTypes(query);
    return buildSuccessResponse<AdminTransactionTypeDto[]>(
      data,
      'OK',
      req.url,
    );
  }

  @Post('transaction-types')
  @Permissions('catalogs.create')
  @ApiOperation({ summary: 'Create a transaction type' })
  @ApiCreatedResponse({ type: AdminTransactionTypeDto })
  createTransactionType(
    @Body() dto: CreateAdminTransactionTypeDto,
  ): Promise<AdminTransactionTypeDto> {
    return this.adminCatalogsService.createTransactionType(dto);
  }

  @Patch('transaction-types/:id')
  @Permissions('catalogs.update')
  @ApiOperation({ summary: 'Update a transaction type' })
  @ApiOkResponse({ type: AdminTransactionTypeDto })
  updateTransactionType(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminTransactionTypeDto,
  ): Promise<AdminTransactionTypeDto> {
    return this.adminCatalogsService.updateTransactionType(id, dto);
  }

  // ── Features ──────────────────────────────────────────────────────────────

  @Get('features')
  @Permissions('catalogs.view', 'features.view')
  @ApiOperation({ summary: 'List all features (including inactive)' })
  @ApiOkResponse({ type: AdminFeatureDto, isArray: true })
  async listFeatures(
    @Query() query: ListAdminFeaturesQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminCatalogsService.listFeatures(query);
    return buildSuccessResponse<AdminFeatureDto[]>(data, 'OK', req.url);
  }

  @Post('features')
  @Permissions('catalogs.create', 'features.create')
  @ApiOperation({ summary: 'Create a feature' })
  @ApiCreatedResponse({ type: AdminFeatureDto })
  createFeature(@Body() dto: CreateAdminFeatureDto): Promise<AdminFeatureDto> {
    return this.adminCatalogsService.createFeature(dto);
  }

  @Patch('features/:id')
  @Permissions('catalogs.update', 'features.update')
  @ApiOperation({ summary: 'Update a feature' })
  @ApiOkResponse({ type: AdminFeatureDto })
  updateFeature(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminFeatureDto,
  ): Promise<AdminFeatureDto> {
    return this.adminCatalogsService.updateFeature(id, dto);
  }

  @Delete('features/:id')
  @HttpCode(HttpStatus.OK)
  @Permissions('catalogs.update', 'features.delete')
  @ApiOperation({
    summary:
      'Delete a feature (hard-delete if unused; otherwise deactivate)',
  })
  deleteFeature(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.adminCatalogsService.deleteFeature(id).then((data) =>
      buildSuccessResponse(data, 'OK', req.url),
    );
  }

  // ── Property views ────────────────────────────────────────────────────────

  @Get('property-views')
  @Permissions('catalogs.view', 'property_views.view')
  @ApiOperation({ summary: 'List all property views (including inactive)' })
  @ApiOkResponse({ type: AdminPropertyViewDto, isArray: true })
  async listPropertyViews(
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminCatalogsService.listPropertyViews(query);
    return buildSuccessResponse<AdminPropertyViewDto[]>(data, 'OK', req.url);
  }

  @Post('property-views')
  @Permissions('catalogs.create', 'property_views.create')
  @ApiOperation({ summary: 'Create a property view' })
  @ApiCreatedResponse({ type: AdminPropertyViewDto })
  createPropertyView(
    @Body() dto: CreateAdminPropertyViewDto,
  ): Promise<AdminPropertyViewDto> {
    return this.adminCatalogsService.createPropertyView(dto);
  }

  @Patch('property-views/:id')
  @Permissions('catalogs.update', 'property_views.update')
  @ApiOperation({ summary: 'Update a property view' })
  @ApiOkResponse({ type: AdminPropertyViewDto })
  updatePropertyView(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminPropertyViewDto,
  ): Promise<AdminPropertyViewDto> {
    return this.adminCatalogsService.updatePropertyView(id, dto);
  }

  @Delete('property-views/:id')
  @HttpCode(HttpStatus.OK)
  @Permissions('catalogs.update', 'property_views.delete')
  @ApiOperation({
    summary:
      'Delete a property view (hard-delete if unused; otherwise deactivate)',
  })
  deletePropertyView(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.adminCatalogsService
      .deletePropertyView(id)
      .then((data) => buildSuccessResponse(data, 'OK', req.url));
  }

  // ── Legal statuses ────────────────────────────────────────────────────────

  @Get('property-legal-statuses')
  @Permissions('catalogs.view', 'property_legal_statuses.view')
  @ApiOperation({
    summary: 'List all property legal statuses (including inactive)',
  })
  @ApiOkResponse({ type: AdminPropertyLegalStatusDto, isArray: true })
  async listPropertyLegalStatuses(
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data =
      await this.adminCatalogsService.listPropertyLegalStatuses(query);
    return buildSuccessResponse<AdminPropertyLegalStatusDto[]>(
      data,
      'OK',
      req.url,
    );
  }

  @Post('property-legal-statuses')
  @Permissions('catalogs.create', 'property_legal_statuses.create')
  @ApiOperation({ summary: 'Create a property legal status' })
  @ApiCreatedResponse({ type: AdminPropertyLegalStatusDto })
  createPropertyLegalStatus(
    @Body() dto: CreateAdminPropertyLegalStatusDto,
  ): Promise<AdminPropertyLegalStatusDto> {
    return this.adminCatalogsService.createPropertyLegalStatus(dto);
  }

  @Patch('property-legal-statuses/:id')
  @Permissions('catalogs.update', 'property_legal_statuses.update')
  @ApiOperation({ summary: 'Update a property legal status' })
  @ApiOkResponse({ type: AdminPropertyLegalStatusDto })
  updatePropertyLegalStatus(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminPropertyLegalStatusDto,
  ): Promise<AdminPropertyLegalStatusDto> {
    return this.adminCatalogsService.updatePropertyLegalStatus(id, dto);
  }

  @Delete('property-legal-statuses/:id')
  @HttpCode(HttpStatus.OK)
  @Permissions('catalogs.update', 'property_legal_statuses.delete')
  @ApiOperation({
    summary:
      'Delete a property legal status (hard-delete if unused; otherwise deactivate)',
  })
  deletePropertyLegalStatus(
    @Param('id', ParseIdPipe) id: string,
    @Req() req: Request,
  ) {
    return this.adminCatalogsService
      .deletePropertyLegalStatus(id)
      .then((data) => buildSuccessResponse(data, 'OK', req.url));
  }

  // ── Finishing types (enum, read-only) ─────────────────────────────────────

  @Get('finishing-types')
  @Permissions('catalogs.view')
  @ApiOperation({
    summary: 'List finishing types from the FinishingType enum (read-only)',
  })
  @ApiOkResponse({ type: AdminFinishingTypeDto, isArray: true })
  listFinishingTypes(@Req() req: Request) {
    const data = this.adminCatalogsService.listFinishingTypes();
    return buildSuccessResponse<AdminFinishingTypeDto[]>(data, 'OK', req.url);
  }
}
