import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators';
import type { AuthUserPayload } from '../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { CreateDraftDto } from './dto/create-draft.dto';
import { ListMyPropertiesQueryDto } from './dto/list-my-properties-query.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyResponseDto } from './mapper/property.mapper';
import { PropertiesService } from './properties.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('drafts')
  @ApiOperation({ summary: 'Create a minimal property draft' })
  @ApiOkResponse({ type: PropertyResponseDto })
  createDraft(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateDraftDto,
  ) {
    return this.propertiesService.createDraft(user.sub, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'List current user properties' })
  @ApiOkResponse({ type: [PropertyResponseDto] })
  listMine(
    @CurrentUser() user: AuthUserPayload,
    @Query() query: ListMyPropertiesQueryDto,
  ) {
    return this.propertiesService.listMine(user.sub, query.status);
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'Get a property owned by the current user' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  getMine(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertiesService.getMine(user.sub, id);
  }

  @Patch('me/:id')
  @ApiOperation({ summary: 'Update a draft property owned by the current user' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  updateDraft(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateDraft(user.sub, id, dto);
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a draft property owned by the current user' })
  @ApiParam({ name: 'id', description: 'Property id' })
  deleteDraft(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertiesService.deleteDraft(user.sub, id);
  }
}
