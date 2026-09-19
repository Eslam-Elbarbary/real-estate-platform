import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Permissions } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { CompanyDto } from '../../companies/mapper/company.mapper';
import { AdminCompaniesService } from '../admin-companies.service';
import { ListAdminCatalogsQueryDto } from '../dto/list-admin-catalogs-query.dto';
import { SetAdminCompanyActiveDto } from '../dto/set-admin-company-active.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/companies')
export class AdminCompaniesController {
  constructor(private readonly adminCompaniesService: AdminCompaniesService) {}

  @Get()
  @Permissions('companies.view')
  @ApiOperation({ summary: 'List all companies (agencies), for moderation' })
  @ApiOkResponse({ type: CompanyDto, isArray: true })
  async list(@Query() query: ListAdminCatalogsQueryDto, @Req() req: Request) {
    const data = await this.adminCompaniesService.list(query);
    return buildSuccessResponse<CompanyDto[]>(data, 'OK', req.url);
  }

  @Patch(':id/active')
  @Permissions('companies.update')
  @ApiOperation({ summary: 'Activate or deactivate a company' })
  setActive(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: SetAdminCompanyActiveDto,
  ): Promise<CompanyDto> {
    return this.adminCompaniesService.setActive(id, dto.isActive);
  }
}
