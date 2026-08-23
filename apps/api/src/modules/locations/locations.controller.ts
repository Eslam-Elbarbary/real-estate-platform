import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import {
  AreaDto,
  CityDto,
  CountryDto,
  CountryTreeNodeDto,
  DistrictDto,
} from './dto/location-response.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Public()
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  @ApiOperation({ summary: 'List active countries' })
  @ApiOkResponse({ type: [CountryDto] })
  getCountries() {
    return this.locationsService.getCountries();
  }

  @Get('countries/:countryId/cities')
  @ApiOperation({ summary: 'List active cities for a country' })
  @ApiParam({ name: 'countryId', description: 'Country id' })
  @ApiOkResponse({ type: [CityDto] })
  getCities(@Param('countryId', ParseIdPipe) countryId: string) {
    return this.locationsService.getCitiesByCountry(countryId);
  }

  @Get('cities/:cityId/areas')
  @ApiOperation({ summary: 'List active areas for a city' })
  @ApiParam({ name: 'cityId', description: 'City id' })
  @ApiOkResponse({ type: [AreaDto] })
  getAreas(@Param('cityId', ParseIdPipe) cityId: string) {
    return this.locationsService.getAreasByCity(cityId);
  }

  @Get('areas/:areaId/districts')
  @ApiOperation({ summary: 'List active districts for an area' })
  @ApiParam({ name: 'areaId', description: 'Area id' })
  @ApiOkResponse({ type: [DistrictDto] })
  getDistricts(@Param('areaId', ParseIdPipe) areaId: string) {
    return this.locationsService.getDistrictsByArea(areaId);
  }

  @Get('tree')
  @ApiOperation({
    summary: 'Full location tree (countries → cities → areas → districts)',
  })
  @ApiOkResponse({ type: [CountryTreeNodeDto] })
  getTree() {
    return this.locationsService.getTree();
  }
}
