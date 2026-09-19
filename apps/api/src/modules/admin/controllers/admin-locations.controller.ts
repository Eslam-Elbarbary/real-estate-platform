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
import { AdminLocationsService } from '../admin-locations.service';
import { CreateAdminAreaDto } from '../dto/create-admin-area.dto';
import { CreateAdminCityDto } from '../dto/create-admin-city.dto';
import { CreateAdminCountryDto } from '../dto/create-admin-country.dto';
import { CreateAdminDistrictDto } from '../dto/create-admin-district.dto';
import { ListAdminCatalogsQueryDto } from '../dto/list-admin-catalogs-query.dto';
import { UpdateAdminAreaDto } from '../dto/update-admin-area.dto';
import { UpdateAdminCityDto } from '../dto/update-admin-city.dto';
import { UpdateAdminCountryDto } from '../dto/update-admin-country.dto';
import { UpdateAdminDistrictDto } from '../dto/update-admin-district.dto';
import {
  AdminAreaDto,
  AdminCityDto,
  AdminCountryDto,
  AdminDistrictDto,
} from '../mapper/admin-location.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/locations')
export class AdminLocationsController {
  constructor(private readonly adminLocationsService: AdminLocationsService) {}

  // ── Countries ─────────────────────────────────────────────────────────────

  @Get('countries')
  @Permissions('catalogs.view', 'locations.view')
  @ApiOperation({ summary: 'List all countries (including inactive)' })
  @ApiOkResponse({ type: AdminCountryDto, isArray: true })
  async listCountries(
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminLocationsService.listCountries(query);
    return buildSuccessResponse<AdminCountryDto[]>(data, 'OK', req.url);
  }

  @Post('countries')
  @Permissions('catalogs.create', 'locations.create')
  @ApiOperation({ summary: 'Create a country' })
  @ApiCreatedResponse({ type: AdminCountryDto })
  createCountry(@Body() dto: CreateAdminCountryDto): Promise<AdminCountryDto> {
    return this.adminLocationsService.createCountry(dto);
  }

  @Patch('countries/:id')
  @Permissions('catalogs.update', 'locations.update')
  @ApiOperation({ summary: 'Update a country' })
  @ApiOkResponse({ type: AdminCountryDto })
  updateCountry(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminCountryDto,
  ): Promise<AdminCountryDto> {
    return this.adminLocationsService.updateCountry(id, dto);
  }

  // ── Cities ────────────────────────────────────────────────────────────────

  @Get('countries/:countryId/cities')
  @Permissions('catalogs.view', 'locations.view')
  @ApiOperation({ summary: 'List all cities for a country (including inactive)' })
  @ApiOkResponse({ type: AdminCityDto, isArray: true })
  async listCities(
    @Param('countryId', ParseIdPipe) countryId: string,
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminLocationsService.listCities(countryId, query);
    return buildSuccessResponse<AdminCityDto[]>(data, 'OK', req.url);
  }

  @Post('countries/:countryId/cities')
  @Permissions('catalogs.create', 'locations.create')
  @ApiOperation({ summary: 'Create a city under a country' })
  @ApiCreatedResponse({ type: AdminCityDto })
  createCity(
    @Param('countryId', ParseIdPipe) countryId: string,
    @Body() dto: CreateAdminCityDto,
  ): Promise<AdminCityDto> {
    return this.adminLocationsService.createCity(countryId, dto);
  }

  @Patch('cities/:id')
  @Permissions('catalogs.update', 'locations.update')
  @ApiOperation({ summary: 'Update a city' })
  @ApiOkResponse({ type: AdminCityDto })
  updateCity(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminCityDto,
  ): Promise<AdminCityDto> {
    return this.adminLocationsService.updateCity(id, dto);
  }

  // ── Areas ─────────────────────────────────────────────────────────────────

  @Get('cities/:cityId/areas')
  @Permissions('catalogs.view', 'locations.view')
  @ApiOperation({ summary: 'List all areas for a city (including inactive)' })
  @ApiOkResponse({ type: AdminAreaDto, isArray: true })
  async listAreas(
    @Param('cityId', ParseIdPipe) cityId: string,
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminLocationsService.listAreas(cityId, query);
    return buildSuccessResponse<AdminAreaDto[]>(data, 'OK', req.url);
  }

  @Post('cities/:cityId/areas')
  @Permissions('catalogs.create', 'locations.create')
  @ApiOperation({ summary: 'Create an area under a city' })
  @ApiCreatedResponse({ type: AdminAreaDto })
  createArea(
    @Param('cityId', ParseIdPipe) cityId: string,
    @Body() dto: CreateAdminAreaDto,
  ): Promise<AdminAreaDto> {
    return this.adminLocationsService.createArea(cityId, dto);
  }

  @Patch('areas/:id')
  @Permissions('catalogs.update', 'locations.update')
  @ApiOperation({ summary: 'Update an area' })
  @ApiOkResponse({ type: AdminAreaDto })
  updateArea(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminAreaDto,
  ): Promise<AdminAreaDto> {
    return this.adminLocationsService.updateArea(id, dto);
  }

  // ── Districts ─────────────────────────────────────────────────────────────

  @Get('areas/:areaId/districts')
  @Permissions('catalogs.view', 'locations.view')
  @ApiOperation({ summary: 'List all districts for an area (including inactive)' })
  @ApiOkResponse({ type: AdminDistrictDto, isArray: true })
  async listDistricts(
    @Param('areaId', ParseIdPipe) areaId: string,
    @Query() query: ListAdminCatalogsQueryDto,
    @Req() req: Request,
  ) {
    const data = await this.adminLocationsService.listDistricts(areaId, query);
    return buildSuccessResponse<AdminDistrictDto[]>(data, 'OK', req.url);
  }

  @Post('areas/:areaId/districts')
  @Permissions('catalogs.create', 'locations.create')
  @ApiOperation({ summary: 'Create a district under an area' })
  @ApiCreatedResponse({ type: AdminDistrictDto })
  createDistrict(
    @Param('areaId', ParseIdPipe) areaId: string,
    @Body() dto: CreateAdminDistrictDto,
  ): Promise<AdminDistrictDto> {
    return this.adminLocationsService.createDistrict(areaId, dto);
  }

  @Patch('districts/:id')
  @Permissions('catalogs.update', 'locations.update')
  @ApiOperation({ summary: 'Update a district' })
  @ApiOkResponse({ type: AdminDistrictDto })
  updateDistrict(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminDistrictDto,
  ): Promise<AdminDistrictDto> {
    return this.adminLocationsService.updateDistrict(id, dto);
  }

  @Delete('districts/:id')
  @HttpCode(HttpStatus.OK)
  @Permissions('catalogs.update', 'locations.delete')
  @ApiOperation({
    summary: 'Delete a district (hard-delete if unused; otherwise deactivate)',
  })
  deleteDistrict(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.adminLocationsService
      .deleteDistrict(id)
      .then((data) => buildSuccessResponse(data, 'OK', req.url));
  }
}
