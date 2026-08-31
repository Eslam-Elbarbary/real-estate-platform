import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { AdminLeadsService } from '../admin-leads.service';
import { ListAdminLeadsQueryDto } from '../dto/list-admin-leads-query.dto';
import { UpdateAdminLeadStatusDto } from '../dto/update-admin-lead-status.dto';
import { AdminLeadDto } from '../mapper/admin-lead.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/leads')
@Roles(RoleCode.ADMIN)
export class AdminLeadsController {
  constructor(private readonly adminLeadsService: AdminLeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads for admin management' })
  @ApiOkResponse({ type: [AdminLeadDto] })
  async listLeads(
    @Query() query: ListAdminLeadsQueryDto,
    @Req() req: Request,
  ) {
    const result = await this.adminLeadsService.listLeads(query);
    return buildSuccessResponse<AdminLeadDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details for admin management' })
  @ApiOkResponse({ type: AdminLeadDto })
  getLeadDetails(@Param('id', ParseIdPipe) id: string): Promise<AdminLeadDto> {
    return this.adminLeadsService.getLeadDetails(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update lead status for admin management' })
  @ApiOkResponse({ type: AdminLeadDto })
  updateLeadStatus(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAdminLeadStatusDto,
  ): Promise<AdminLeadDto> {
    return this.adminLeadsService.updateLeadStatus(id, dto);
  }
}
