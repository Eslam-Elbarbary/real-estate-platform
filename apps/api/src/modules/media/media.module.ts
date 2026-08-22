import { Module } from '@nestjs/common';
import { MEDIA_PROVIDER } from './interfaces/media-provider.interface';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { MediaService } from './media.service';

@Module({
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
