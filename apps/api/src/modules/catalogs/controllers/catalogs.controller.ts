import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators';
import { CatalogsService } from '../catalogs.service';
import {
  CatalogFeatureDto,
  CatalogLegalStatusDto,
  CatalogPropertyTypeDto,
  CatalogPropertyViewDto,
  CatalogTransactionTypeDto,
} from '../mapper/catalog.mapper';

@ApiTags('catalogs')
@Public()
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('property-types')
  @ApiOperation({ summary: 'List active property types for property creation' })
  @ApiOkResponse({ type: [CatalogPropertyTypeDto] })
  getPropertyTypes() {
    return this.catalogsService.getPropertyTypes();
  }

  @Get('transaction-types')
  @ApiOperation({ summary: 'List active transaction types for property creation' })
  @ApiOkResponse({ type: [CatalogTransactionTypeDto] })
  getTransactionTypes() {
    return this.catalogsService.getTransactionTypes();
  }

  @Get('features')
  @ApiOperation({ summary: 'List active property features for property creation' })
  @ApiOkResponse({ type: [CatalogFeatureDto] })
  getFeatures() {
    return this.catalogsService.getFeatures();
  }

  @Get('property-views')
  @ApiOperation({ summary: 'List active property views for property creation' })
  @ApiOkResponse({ type: [CatalogPropertyViewDto] })
  getPropertyViews() {
    return this.catalogsService.getPropertyViews();
  }

  @Get('property-legal-statuses')
  @ApiOperation({
    summary: 'List active property legal statuses for property creation',
  })
  @ApiOkResponse({ type: [CatalogLegalStatusDto] })
  getLegalStatuses() {
    return this.catalogsService.getLegalStatuses();
  }
}
