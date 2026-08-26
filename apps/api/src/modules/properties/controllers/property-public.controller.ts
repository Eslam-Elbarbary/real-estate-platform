import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../../../common/decorators';
import { SearchPropertiesDto } from '../dto/search-properties.dto';
import { PublicPropertyDetailsDto } from '../mapper/property-public.mapper';
import { PropertyPublicService } from '../services/property-public.service';

@ApiTags('properties')
@Public()
@Controller('properties')
export class PropertyPublicController {
  constructor(private readonly propertyPublicService: PropertyPublicService) {}

  @Get()
  @ApiOperation({ summary: 'Search published properties' })
  search(@Query() query: SearchPropertiesDto, @Req() req: Request) {
    return this.propertyPublicService.search(query, req.url);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published property by slug' })
  @ApiParam({ name: 'slug', description: 'Property slug' })
  @ApiOkResponse({ type: PublicPropertyDetailsDto })
  getBySlug(@Param('slug') slug: string) {
    return this.propertyPublicService.getBySlug(slug);
  }
}
