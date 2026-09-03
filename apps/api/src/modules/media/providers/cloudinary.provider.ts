import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { AppLoggerService } from '../../../common/logger/app-logger.service';
import {
  MediaDeleteInput,
  MediaProvider,
  MediaUploadInput,
  MediaUploadResult,
} from '../interfaces/media-provider.interface';

/**
 * Cloudinary MediaProvider — real upload/delete via Cloudinary SDK.
 */
@Injectable()
export class CloudinaryProvider implements MediaProvider {
  readonly name = 'cloudinary';

  private readonly configured: boolean;
  private readonly defaultFolder: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(CloudinaryProvider.name);

    const cloudName = this.configService.get<string>('cloudinary.cloudName');
    const apiKey = this.configService.get<string>('cloudinary.apiKey');
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret');
    this.defaultFolder = this.configService.get<string>('cloudinary.folder') ?? 'aqarmap';

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      const tlsInsecure = this.configService.get<boolean>('cloudinary.tlsInsecure', false);
      if (tlsInsecure && process.env.NODE_ENV !== 'production') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        this.logger.warn(
          'CLOUDINARY_TLS_INSECURE=true — TLS certificate verification disabled for local uploads',
        );
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.logger.log('Cloudinary provider configured');
    } else {
      this.logger.warn(
        'Cloudinary credentials are not fully configured — media uploads are disabled',
      );
    }
  }

  async upload(input: MediaUploadInput): Promise<MediaUploadResult> {
    this.ensureConfigured();

    if (!input.buffer && !input.source) {
      throw new ServiceUnavailableException(
        'Media upload requires a file buffer or source URL',
      );
    }

    const options = {
      folder: input.folder ?? this.defaultFolder,
      public_id: input.publicId,
      resource_type: (input.resourceType ?? 'image') as
        'image' | 'video' | 'raw' | 'auto',
      tags: input.tags,
      overwrite: true,
      unique_filename: !input.publicId,
    };

    let result: UploadApiResponse;

    try {
      if (input.buffer) {
        result = await this.uploadBuffer(input.buffer, options);
      } else {
        result = await cloudinary.uploader.upload(input.source!, options);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cloudinary upload failed';
      this.logger.error(`Cloudinary upload failed: ${message}`);
      throw new ServiceUnavailableException(
        message.includes('unable to verify the first certificate')
          ? 'Cloudinary TLS certificate verification failed. Set CLOUDINARY_TLS_INSECURE=true for local development.'
          : `Cloudinary upload failed: ${message}`,
      );
    }

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      provider: this.name,
    };
  }

  async delete(input: MediaDeleteInput): Promise<void> {
    this.ensureConfigured();

    await cloudinary.uploader.destroy(input.publicId, {
      resource_type: (input.resourceType ?? 'image') as 'image' | 'video' | 'raw',
    });
  }

  private uploadBuffer(
    buffer: Buffer,
    options: Record<string, unknown>,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload returned empty result'));
          return;
        }
        resolve(result);
      });
      stream.end(buffer);
    });
  }

  private ensureConfigured(): void {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        'Cloudinary is not configured. Set CLOUDINARY_* environment variables.',
      );
    }
  }
}
