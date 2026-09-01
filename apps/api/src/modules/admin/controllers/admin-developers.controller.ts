import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
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
import { CreateDeveloperDto } from '../../developers/dto/create-developer.dto';
import { ListDevelopersQueryDto } from '../../developers/dto/list-developers-query.dto';
import { UpdateDeveloperDto } from '../../developers/dto/update-developer.dto';
import { DevelopersService } from '../../developers/developers.service';
import {
  AdminDeveloperDetailsDto,
  AdminDeveloperDto,
} from '../../developers/mapper/developer.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/developers')
@Roles(RoleCode.ADMIN)
export class AdminDevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  @ApiOperation({ summary: 'List developers for admin management' })
  @ApiOkResponse({ type: AdminDeveloperDto, isArray: true })
  async listDevelopers(@Query() query: ListDevelopersQueryDto, @Req() req: Request) {
    const result = await this.developersService.listAdmin(query);
    return buildSuccessResponse<AdminDeveloperDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a developer' })
  @ApiCreatedResponse({ type: AdminDeveloperDto })
  createDeveloper(@Body() dto: CreateDeveloperDto): Promise<AdminDeveloperDto> {
    return this.developersService.createAdmin(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get developer details for admin management' })
  @ApiOkResponse({ type: AdminDeveloperDetailsDto })
  getDeveloper(
    @Param('id', ParseIdPipe) id: string,
  ): Promise<AdminDeveloperDetailsDto> {
    return this.developersService.getAdminById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a developer' })
  @ApiOkResponse({ type: AdminDeveloperDto })
  updateDeveloper(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateDeveloperDto,
  ): Promise<AdminDeveloperDto> {
    return this.developersService.updateAdmin(id, dto);
  }
}
