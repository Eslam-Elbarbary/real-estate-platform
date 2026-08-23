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
import { UpdateDetailsDto } from '../dto/update-details.dto';
import { PropertyResponseDto } from '../mapper/property.mapper';
import { PropertiesService } from '../properties.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertyDetailsController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Patch('me/:id/details')
  @ApiOperation({ summary: 'Update draft property details (wizard step)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  updateDetails(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateDetailsDto,
  ) {
    return this.propertiesService.updateDetails(user.sub, id, dto);
  }
}
