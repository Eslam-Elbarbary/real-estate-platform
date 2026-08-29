import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators';
import { CatalogsService } from '../catalogs.service';
import {
  CatalogFeatureDto,
  CatalogPropertyTypeDto,
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
}
