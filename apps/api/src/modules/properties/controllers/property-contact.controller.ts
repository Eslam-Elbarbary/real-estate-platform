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
import {
  PropertyContactResponseDto,
  PublicPropertyContactViewDto,
  UpsertPropertyContactDto,
} from '../dto/upsert-property-contact.dto';
import { PropertyContactService } from '../services/property-contact.service';

@ApiTags('properties')
@Controller('properties')
export class PropertyContactController {
  constructor(private readonly propertyContactService: PropertyContactService) {}

  @Get('me/:id/contact')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get contact for an owned property (resolved)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyContactResponseDto })
  getMine(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertyContactService.getForOwner(user.sub, id);
  }

  @Put('me/:id/contact')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Upsert contact for an owned property draft' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyContactResponseDto })
  upsertMine(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpsertPropertyContactDto,
  ) {
    return this.propertyContactService.upsertForOwner(user.sub, id, dto);
  }

  @Public()
  @Get(':id/contact')
  @ApiOperation({ summary: 'Get public contact for a published property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PublicPropertyContactViewDto })
  getPublic(@Param('id', ParseIdPipe) id: string) {
    return this.propertyContactService.getPublicByPropertyId(id);
  }
}
