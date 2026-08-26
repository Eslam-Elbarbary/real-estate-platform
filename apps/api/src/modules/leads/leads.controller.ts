import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import {
  BuyerLeadResponseDto,
  LeadCreatedResponseDto,
  SellerLeadResponseDto,
} from './mapper/lead.mapper';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@ApiBearerAuth('access-token')
@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('properties/:id/leads')
  @ApiOperation({ summary: 'Contact seller / create a lead on a published property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: LeadCreatedResponseDto })
  create(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: CreateLeadDto,
  ) {
    return this.leadsService.create(user.sub, id, dto);
  }

  @Get('leads/me')
  @ApiOperation({ summary: 'List leads created by the current user (buyer)' })
  @ApiOkResponse({ type: [BuyerLeadResponseDto] })
  listMine(@CurrentUser() user: AuthUserPayload) {
    return this.leadsService.listMine(user.sub);
  }

  @Patch('leads/:id/status')
  @ApiOperation({ summary: 'Update lead status (property owner only)' })
  @ApiParam({ name: 'id', description: 'Lead id' })
  @ApiOkResponse({ type: SellerLeadResponseDto })
  updateStatus(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(user.sub, id, dto);
  }
}
