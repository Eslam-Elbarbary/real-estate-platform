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
import { CurrentUser } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { ReorderMediaDto } from '../dto/reorder-media.dto';
import { PropertyImageResponseDto } from '../mapper/property-image.mapper';
import { PropertyMediaService } from '../services/property-media.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertyMediaController {
  constructor(private readonly propertyMediaService: PropertyMediaService) {}

  @Post('me/:id/media')
  @ApiOperation({ summary: 'Upload an image to a draft property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ type: PropertyImageResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertyMediaService.uploadImage(user.sub, id, file);
  }

  @Get('me/:id/media')
  @ApiOperation({ summary: 'List images for a property owned by current user' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: [PropertyImageResponseDto] })
  list(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertyMediaService.listImages(user.sub, id);
  }

  @Patch('me/:id/media/reorder')
  @ApiOperation({ summary: 'Reorder images on a draft property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: [PropertyImageResponseDto] })
  reorder(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: ReorderMediaDto,
  ) {
    return this.propertyMediaService.reorderImages(user.sub, id, dto);
  }

  @Patch('me/:id/media/:imageId/primary')
  @ApiOperation({ summary: 'Set the primary image on a draft property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiParam({ name: 'imageId', description: 'Property image id' })
  @ApiOkResponse({ type: PropertyImageResponseDto })
  setPrimary(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('imageId', ParseIdPipe) imageId: string,
  ) {
    return this.propertyMediaService.setPrimaryImage(user.sub, id, imageId);
  }

  @Delete('me/:id/media/:imageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an image from a draft property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiParam({ name: 'imageId', description: 'Property image id' })
  remove(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('imageId', ParseIdPipe) imageId: string,
  ) {
    return this.propertyMediaService.deleteImage(user.sub, id, imageId);
  }
}
