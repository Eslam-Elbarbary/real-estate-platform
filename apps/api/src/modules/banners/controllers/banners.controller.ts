import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators';
import { BannersService } from '../banners.service';
import { ListPublicBannersQueryDto } from '../dto/list-banners-query.dto';
import { PublicBannerDto } from '../mapper/banner.mapper';

@ApiTags('banners')
@Public()
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'List active public banners (optional position filter)' })
  @ApiOkResponse({ type: PublicBannerDto, isArray: true })
  list(@Query() query: ListPublicBannersQueryDto): Promise<PublicBannerDto[]> {
    return this.bannersService.listPublic(query.position);
  }
}
