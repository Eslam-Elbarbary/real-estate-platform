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
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Permissions } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { BannersService } from '../banners.service';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { ListAdminBannersQueryDto } from '../dto/list-banners-query.dto';
import { ReorderBannersDto } from '../dto/reorder-banners.dto';
import { UpdateBannerDto } from '../dto/update-banner.dto';
import { AdminBannerDto } from '../mapper/banner.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/banners')
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @Permissions('banners.view')
  @ApiOperation({ summary: 'List all banners for admin management' })
  @ApiOkResponse({ type: AdminBannerDto, isArray: true })
  async list(@Query() query: ListAdminBannersQueryDto, @Req() req: Request) {
    const data = await this.bannersService.listAdmin(query);
    return buildSuccessResponse<AdminBannerDto[]>(data, 'OK', req.url);
  }

  @Post()
  @Permissions('banners.create')
  @ApiOperation({ summary: 'Create a banner' })
  @ApiCreatedResponse({ type: AdminBannerDto })
  create(@Body() dto: CreateBannerDto): Promise<AdminBannerDto> {
    return this.bannersService.create(dto);
  }

  @Patch('reorder')
  @Permissions('banners.update')
  @ApiOperation({ summary: 'Reorder banners' })
  @ApiOkResponse({ type: AdminBannerDto, isArray: true })
  reorder(@Body() dto: ReorderBannersDto): Promise<AdminBannerDto[]> {
    return this.bannersService.reorder(dto);
  }

  @Patch(':id')
  @Permissions('banners.update')
  @ApiOperation({ summary: 'Update a banner' })
  @ApiOkResponse({ type: AdminBannerDto })
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateBannerDto,
  ): Promise<AdminBannerDto> {
    return this.bannersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('banners.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a banner' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIdPipe) id: string): Promise<void> {
    await this.bannersService.remove(id);
  }
}
