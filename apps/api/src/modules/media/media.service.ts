import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_PROVIDER,
  MediaDeleteInput,
  MediaProvider,
  MediaUploadInput,
  MediaUploadResult,
} from './interfaces/media-provider.interface';

/**
 * Application-facing media service.
 * Delegates to the injected MediaProvider (Cloudinary by default).
 */
@Injectable()
export class MediaService {
  constructor(
    @Inject(MEDIA_PROVIDER)
    private readonly mediaProvider: MediaProvider,
  ) {}

  upload(input: MediaUploadInput): Promise<MediaUploadResult> {
    return this.mediaProvider.upload(input);
  }

  delete(input: MediaDeleteInput): Promise<void> {
    return this.mediaProvider.delete(input);
  }

  getProviderName(): string {
    return this.mediaProvider.name;
  }
}
