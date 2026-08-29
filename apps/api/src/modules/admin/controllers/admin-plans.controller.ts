import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { CreatePlanDto } from '../../plans/dto/create-plan.dto';
import { ListAdminPlansQueryDto } from '../../plans/dto/list-admin-plans-query.dto';
import { UpdatePlanDto } from '../../plans/dto/update-plan.dto';
import { AdminPlanDto } from '../../plans/mapper/plan.mapper';
import { PlansService } from '../../plans/plans.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/plans')
@Roles(RoleCode.ADMIN)
export class AdminPlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all plans for admin management' })
  async listPlans(@Query() query: ListAdminPlansQueryDto, @Req() req: Request) {
    const result = await this.plansService.listAdmin(query);
    return buildSuccessResponse<AdminPlanDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a listing plan' })
  @ApiCreatedResponse({ type: AdminPlanDto })
  createPlan(@Body() dto: CreatePlanDto): Promise<AdminPlanDto> {
    return this.plansService.createAdmin(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan details for admin management' })
  @ApiOkResponse({ type: AdminPlanDto })
  getPlan(@Param('id', ParseIdPipe) id: string): Promise<AdminPlanDto> {
    return this.plansService.getAdminById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a listing plan' })
  @ApiOkResponse({ type: AdminPlanDto })
  updatePlan(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdatePlanDto,
  ): Promise<AdminPlanDto> {
    return this.plansService.updateAdmin(id, dto);
  }
}
