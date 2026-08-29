import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { CompoundsService } from '../../compounds/compounds.service';
import { CreateCompoundDto } from '../../compounds/dto/create-compound.dto';
import { ListAdminCompoundsQueryDto } from '../../compounds/dto/list-admin-compounds-query.dto';
import { UpdateCompoundDto } from '../../compounds/dto/update-compound.dto';
import { AdminCompoundDto } from '../../compounds/mapper/compound.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/compounds')
@Roles(RoleCode.ADMIN)
export class AdminCompoundsController {
  constructor(private readonly compoundsService: CompoundsService) {}

  @Get()
  @ApiOperation({ summary: 'List compounds for admin management' })
  async listCompounds(@Query() query: ListAdminCompoundsQueryDto, @Req() req: Request) {
    const result = await this.compoundsService.listAdmin(query);
    return buildSuccessResponse<AdminCompoundDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a compound' })
  createCompound(@Body() dto: CreateCompoundDto): Promise<AdminCompoundDto> {
    return this.compoundsService.createAdmin(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a compound' })
  updateCompound(
    @Param('id') id: string,
    @Body() dto: UpdateCompoundDto,
  ): Promise<AdminCompoundDto> {
    return this.compoundsService.updateAdmin(id, dto);
  }
}
