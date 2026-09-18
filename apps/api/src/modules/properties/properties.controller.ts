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
import { LeadsService } from '../leads/leads.service';
import { SellerLeadResponseDto } from '../leads/mapper/lead.mapper';
import { CreateDraftDto } from './dto/create-draft.dto';
import { ListMyPropertiesQueryDto } from './dto/list-my-properties-query.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  OwnerPropertyStatusHistoryDto,
  PropertyResponseDto,
} from './mapper/property.mapper';
import { PropertiesService } from './properties.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly leadsService: LeadsService,
  ) {}

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

  @Get('me/leads')
  @ApiTags('leads')
  @ApiOperation({ summary: 'List leads for properties owned by the current user' })
  @ApiOkResponse({ type: [SellerLeadResponseDto] })
  listMyPropertyLeads(@CurrentUser() user: AuthUserPayload) {
    return this.leadsService.listForSeller(user.sub);
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

  @Get('me/:id/status-history')
  @ApiOperation({
    summary: 'Status history for a property owned by the current user',
  })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: [OwnerPropertyStatusHistoryDto] })
  listStatusHistory(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertiesService.listStatusHistory(user.sub, id);
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

  @Patch('me/:id/archive')
  @ApiOperation({
    summary: 'Archive a published, rejected, or expired property owned by the current user',
  })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  archiveMine(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertiesService.archiveMine(user.sub, id);
  }

  @Patch('me/:id/restore')
  @ApiOperation({ summary: 'Restore an archived property owned by the current user to draft' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  restoreMine(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertiesService.restoreMine(user.sub, id);
  }
}
