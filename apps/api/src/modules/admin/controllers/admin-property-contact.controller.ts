import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../../../common/decorators';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import {
  PropertyContactResponseDto,
  UpsertPropertyContactDto,
} from '../../properties/dto/upsert-property-contact.dto';
import { PropertyContactService } from '../../properties/services/property-contact.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/properties')
export class AdminPropertyContactController {
  constructor(private readonly propertyContactService: PropertyContactService) {}

  @Get(':id/contact')
  @Permissions('properties.view')
  @ApiOperation({ summary: 'Get property contact (admin)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyContactResponseDto })
  get(@Param('id', ParseIdPipe) id: string) {
    return this.propertyContactService.getForAdmin(id);
  }

  @Put(':id/contact')
  @Permissions('properties.update')
  @ApiOperation({ summary: 'Upsert property contact (admin)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyContactResponseDto })
  upsert(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpsertPropertyContactDto,
  ) {
    return this.propertyContactService.upsertForAdmin(id, dto);
  }
}
