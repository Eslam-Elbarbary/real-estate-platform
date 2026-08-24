import { Module } from '@nestjs/common';
import { MEDIA_PROVIDER } from './interfaces/media-provider.interface';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  controllers: [MediaController],
  providers: [
    CloudinaryProvider,
    {
      provide: MEDIA_PROVIDER,
      useExisting: CloudinaryProvider,
    },
    MediaService,
  ],
  exports: [MediaService, MEDIA_PROVIDER],
})
export class MediaModule {}
