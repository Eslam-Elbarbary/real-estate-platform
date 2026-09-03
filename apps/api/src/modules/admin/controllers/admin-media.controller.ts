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
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { CurrentUser, Permissions } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { AdminMediaService } from '../admin-media.service';
import { ListAdminMediaQueryDto } from '../dto/list-admin-media-query.dto';
import { UploadAdminMediaDto } from '../dto/upload-admin-media.dto';
import { AdminMediaDto } from '../mapper/admin-media.mapper';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_UPLOAD_FILES = 10;

@ApiTags('Admin Media')
@ApiBearerAuth('access-token')
@Controller('admin/media')
export class AdminMediaController {
  constructor(private readonly adminMediaService: AdminMediaService) {}

  @Get()
  @Permissions('media.view')
  @ApiOperation({ summary: 'List all platform media assets' })
  @ApiOkResponse({ type: AdminMediaDto, isArray: true })
  async listMedia(
    @Query() query: ListAdminMediaQueryDto,
    @Req() req: Request,
  ) {
    const result = await this.adminMediaService.listMedia(query);
    return buildSuccessResponse<AdminMediaDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Post('upload')
  @Permissions('media.upload')
  @ApiOperation({ summary: 'Upload one or more images to the media library' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        folder: {
          type: 'string',
          example: 'aqarmap/library',
        },
      },
    },
  })
  @ApiOkResponse({ type: AdminMediaDto, isArray: true })
  @UseInterceptors(
    FilesInterceptor('files', MAX_UPLOAD_FILES, {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_BYTES },
    }),
  )
  uploadMedia(
    @CurrentUser() user: AuthUserPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UploadAdminMediaDto,
  ): Promise<AdminMediaDto[]> {
    return this.adminMediaService.uploadMedia(user.sub, files, dto.folder);
  }

  @Delete(':id')
  @Permissions('media.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a media asset from Cloudinary and the database' })
  @ApiParam({ name: 'id', description: 'Media asset id' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Media asset deleted successfully' },
      },
    },
  })
  deleteMedia(@Param('id', ParseIdPipe) id: string) {
    return this.adminMediaService.deleteMedia(id);
  }
}
