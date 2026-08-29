import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../../common/decorators';
import { buildSuccessResponse } from '../../common/interfaces/api-response.interface';
import { ListDevelopersQueryDto } from './dto/list-developers-query.dto';
import {
  PublicDeveloperCardDto,
  PublicDeveloperDetailsDto,
} from './mapper/developer.mapper';
import { DevelopersService } from './developers.service';

@ApiTags('developers')
@Public()
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  @ApiOperation({ summary: 'List active developers' })
  @ApiOkResponse({ type: [PublicDeveloperCardDto] })
  async list(@Query() query: ListDevelopersQueryDto, @Req() req: Request) {
    const result = await this.developersService.listPublic(query);
    return buildSuccessResponse<PublicDeveloperCardDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an active developer by slug' })
  @ApiParam({ name: 'slug', description: 'Developer slug' })
  @ApiOkResponse({ type: PublicDeveloperDetailsDto })
  getBySlug(@Param('slug') slug: string): Promise<PublicDeveloperDetailsDto> {
    return this.developersService.getPublicBySlug(slug);
  }
}
