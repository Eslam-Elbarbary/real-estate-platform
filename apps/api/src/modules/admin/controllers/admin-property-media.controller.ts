import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { CurrentUser, Permissions } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { ReorderMediaDto } from '../../properties/dto/reorder-media.dto';
import { AdminPropertyMediaService } from '../admin-property-media.service';
import { AttachAdminPropertyMediaDto } from '../dto/attach-admin-property-media.dto';
import { AdminPropertyImageDto } from '../mapper/admin-property.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/properties')
export class AdminPropertyMediaController {
  constructor(
    private readonly adminPropertyMediaService: AdminPropertyMediaService,
  ) {}

  @Get(':id/media')
  @Permissions('properties.view')
  @ApiOperation({ summary: 'List media for an admin-managed property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: [AdminPropertyImageDto] })
  list(@Param('id', ParseIdPipe) id: string) {
    return this.adminPropertyMediaService.list(id);
  }

  @Post(':id/media')
  @Permissions('properties.update')
  @ApiOperation({
    summary:
      'Attach a media library asset to a property (preferred). Multipart file upload is also supported.',
  })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({
    schema: {
      oneOf: [
        {
          type: 'object',
          required: ['mediaAssetId'],
          properties: {
            mediaAssetId: { type: 'string' },
            type: { type: 'string', enum: ['IMAGE', 'VIDEO', 'DOCUMENT'] },
            sortOrder: { type: 'integer' },
            isPrimary: { type: 'boolean' },
          },
        },
        {
          type: 'object',
          required: ['file'],
          properties: {
            file: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @ApiOkResponse({ type: AdminPropertyImageDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadOrAttach(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: AttachAdminPropertyMediaDto,
  ) {
    if (file) {
      return this.adminPropertyMediaService.upload(user.sub, id, file);
    }
    if (!body.mediaAssetId?.trim()) {
      throw new BadRequestException(
        'Provide mediaAssetId or upload a multipart file',
      );
    }
    return this.adminPropertyMediaService.attach(id, {
      ...body,
      mediaAssetId: body.mediaAssetId.trim(),
    });
  }

  @Patch(':id/media/reorder')
  @Permissions('properties.update')
  @ApiOperation({ summary: 'Reorder property media (admin)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: [AdminPropertyImageDto] })
  reorder(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: ReorderMediaDto,
  ) {
    return this.adminPropertyMediaService.reorder(id, dto);
  }

  @Patch(':id/media/:imageId/primary')
  @Permissions('properties.update')
  @ApiOperation({ summary: 'Set primary property media (admin)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiParam({ name: 'imageId', description: 'Property image id' })
  @ApiOkResponse({ type: AdminPropertyImageDto })
  setPrimary(
    @Param('id', ParseIdPipe) id: string,
    @Param('imageId', ParseIdPipe) imageId: string,
  ) {
    return this.adminPropertyMediaService.setPrimary(id, imageId);
  }

  @Delete(':id/media/:imageId')
  @HttpCode(HttpStatus.OK)
  @Permissions('properties.update')
  @ApiOperation({ summary: 'Delete property media (admin)' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiParam({ name: 'imageId', description: 'Property image id' })
  remove(
    @Param('id', ParseIdPipe) id: string,
    @Param('imageId', ParseIdPipe) imageId: string,
  ) {
    return this.adminPropertyMediaService.delete(id, imageId);
  }
}
