import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../common/decorators';
import type { AuthUserPayload } from '../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { ListMediaQueryDto } from './dto/list-media-query.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaAssetResponseDto } from './mapper/media-asset.mapper';
import { MediaService } from './media.service';

@ApiTags('media')
@ApiBearerAuth('access-token')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image to the media library' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'aqarmap/library' },
      },
    },
  })
  @ApiOkResponse({ type: MediaAssetResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(
    @CurrentUser() user: AuthUserPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.uploadLibraryAsset(user.sub, file, dto.folder);
  }

  @Get()
  @ApiOperation({ summary: 'List current user media library assets' })
  list(
    @CurrentUser() user: AuthUserPayload,
    @Query() query: ListMediaQueryDto,
  ) {
    return this.mediaService.listLibraryAssets(user.sub, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a media asset (owner or admin)' })
  @ApiParam({ name: 'id', description: 'Media asset id' })
  remove(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.mediaService.deleteLibraryAsset(user.sub, user.roles, id);
  }
}
