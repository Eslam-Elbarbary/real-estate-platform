export type MediaResourceType = 'image' | 'video' | 'raw' | 'auto';

export interface MediaUploadInput {
  /** Local file path, remote URL, or data URI — provider-specific. */
  source: string;
  folder?: string;
  publicId?: string;
  resourceType?: MediaResourceType;
  tags?: string[];
}

export interface MediaUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  resourceType: string;
  bytes?: number;
  width?: number;
  height?: number;
  provider: string;
}

export interface MediaDeleteInput {
  publicId: string;
  resourceType?: MediaResourceType;
}

/**
 * Abstraction over object/media storage providers.
 * Controllers/services depend on this interface — never on Cloudinary directly.
 */
export interface MediaProvider {
  readonly name: string;
  upload(input: MediaUploadInput): Promise<MediaUploadResult>;
  delete(input: MediaDeleteInput): Promise<void>;
}

export const MEDIA_PROVIDER = Symbol('MEDIA_PROVIDER');
