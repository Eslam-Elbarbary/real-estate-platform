import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { PropertyResponseDto } from '../mapper/property.mapper';
import { PropertiesService } from '../properties.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertyLocationController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Patch('me/:id/location')
  @ApiOperation({ summary: 'Update draft location (wizard step)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  updateLocation(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.propertiesService.updateLocation(user.sub, id, dto);
  }
}
