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
import { CompoundsService } from './compounds.service';
import { ListCompoundsQueryDto } from './dto/list-compounds-query.dto';
import {
  PublicCompoundCardDto,
  PublicCompoundDetailsDto,
} from './mapper/compound.mapper';

@ApiTags('compounds')
@Public()
@Controller('compounds')
export class CompoundsController {
  constructor(private readonly compoundsService: CompoundsService) {}

  @Get()
  @ApiOperation({ summary: 'List active compounds' })
  @ApiOkResponse({ type: [PublicCompoundCardDto] })
  async list(@Query() query: ListCompoundsQueryDto, @Req() req: Request) {
    const result = await this.compoundsService.listPublic(query);
    return buildSuccessResponse<PublicCompoundCardDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an active compound by slug' })
  @ApiParam({ name: 'slug', description: 'Compound slug' })
  @ApiOkResponse({ type: PublicCompoundDetailsDto })
  getBySlug(@Param('slug') slug: string): Promise<PublicCompoundDetailsDto> {
    return this.compoundsService.getPublicBySlug(slug);
  }
}
