import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '../../../common/logger/app-logger.service';
import {
  MediaDeleteInput,
  MediaProvider,
  MediaUploadInput,
  MediaUploadResult,
} from '../interfaces/media-provider.interface';

/**
 * Cloudinary MediaProvider placeholder.
 * Credentials are loaded from config; upload/delete throw until fully wired
 * in the media implementation phase (SDK calls intentionally not executed yet).
 */
@Injectable()
export class CloudinaryProvider implements MediaProvider {
  readonly name = 'cloudinary';

  private readonly configured: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(CloudinaryProvider.name);

    const cloudName = this.configService.get<string>('cloudinary.cloudName');
    const apiKey = this.configService.get<string>('cloudinary.apiKey');
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret');

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (!this.configured) {
      this.logger.warn(
        'Cloudinary credentials are not fully configured — media uploads are disabled',
      );
    } else {
      this.logger.log('Cloudinary provider structure ready (implementation pending)');
    }
  }

  async upload(_input: MediaUploadInput): Promise<MediaUploadResult> {
    this.ensureConfigured();
    throw new ServiceUnavailableException(
      'Cloudinary upload is not implemented yet — foundation placeholder only',
    );
  }

  async delete(_input: MediaDeleteInput): Promise<void> {
    this.ensureConfigured();
    throw new ServiceUnavailableException(
      'Cloudinary delete is not implemented yet — foundation placeholder only',
    );
  }

  private ensureConfigured(): void {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        'Cloudinary is not configured. Set CLOUDINARY_* environment variables.',
      );
    }
  }
}
