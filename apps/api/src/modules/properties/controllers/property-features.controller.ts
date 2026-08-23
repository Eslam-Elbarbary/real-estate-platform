import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { SetFeaturesDto } from '../dto/set-features.dto';
import { FeatureResponseDto } from '../mapper/feature.mapper';
import { PropertyResponseDto } from '../mapper/property.mapper';
import { PropertiesService } from '../properties.service';

@ApiTags('features')
@Controller()
export class PropertyFeaturesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Public()
  @Get('features')
  @ApiOperation({ summary: 'List active property features catalog' })
  @ApiOkResponse({ type: [FeatureResponseDto] })
  listFeatures() {
    return this.propertiesService.listFeatures();
  }

  @ApiTags('properties')
  @ApiBearerAuth('access-token')
  @Put('properties/me/:id/features')
  @ApiOperation({ summary: 'Replace features on a draft property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  replaceFeatures(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: SetFeaturesDto,
  ) {
    return this.propertiesService.replaceFeatures(user.sub, id, dto);
  }
}
