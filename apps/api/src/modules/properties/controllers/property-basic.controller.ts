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
import { UpdateBasicDto } from '../dto/update-basic.dto';
import { PropertyResponseDto } from '../mapper/property.mapper';
import { PropertiesService } from '../properties.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertyBasicController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Patch('me/:id/basic')
  @ApiOperation({ summary: 'Update draft basic information (wizard step)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  updateBasic(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateBasicDto,
  ) {
    return this.propertiesService.updateBasic(user.sub, id, dto);
  }
}
