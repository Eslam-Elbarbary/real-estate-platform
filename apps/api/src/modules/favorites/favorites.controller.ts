import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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
import { FavoritesService } from './favorites.service';
import {
  FavoriteCheckDto,
  FavoriteResponseDto,
} from './mapper/favorite.mapper';

@ApiTags('favorites')
@ApiBearerAuth('access-token')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List current user favorites' })
  @ApiOkResponse({ type: [FavoriteResponseDto] })
  list(@CurrentUser() user: AuthUserPayload) {
    return this.favoritesService.list(user.sub);
  }

  @Get(':propertyId/check')
  @ApiOperation({ summary: 'Check if a property is favorited' })
  @ApiParam({ name: 'propertyId', description: 'Property id' })
  @ApiOkResponse({ type: FavoriteCheckDto })
  check(
    @CurrentUser() user: AuthUserPayload,
    @Param('propertyId', ParseIdPipe) propertyId: string,
  ) {
    return this.favoritesService.check(user.sub, propertyId);
  }

  @Post(':propertyId')
  @ApiOperation({ summary: 'Add a property to favorites' })
  @ApiParam({ name: 'propertyId', description: 'Property id' })
  @ApiOkResponse({ type: FavoriteResponseDto })
  add(
    @CurrentUser() user: AuthUserPayload,
    @Param('propertyId', ParseIdPipe) propertyId: string,
  ) {
    return this.favoritesService.add(user.sub, propertyId);
  }

  @Delete(':propertyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a property from favorites' })
  @ApiParam({ name: 'propertyId', description: 'Property id' })
  remove(
    @CurrentUser() user: AuthUserPayload,
    @Param('propertyId', ParseIdPipe) propertyId: string,
  ) {
    return this.favoritesService.remove(user.sub, propertyId);
  }
}
