import 'server-only';

import { uploadMultipart } from '@/lib/api/client';
import type { UploadedPropertyImage } from './types';

interface MediaAssetResponse {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

const MEDIA_UPLOAD_PATH = '/api/v1/media/upload';
const PROPERTY_MEDIA_FOLDER = 'aqarmap/listings';

export async function uploadPropertyImageFile(
  file: File,
  accessToken: string,
): Promise<UploadedPropertyImage> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', PROPERTY_MEDIA_FOLDER);

  const asset = await uploadMultipart<MediaAssetResponse>(
    MEDIA_UPLOAD_PATH,
    formData,
    accessToken,
  );

  return {
    id: asset.id,
    url: asset.url,
    name: asset.fileName || file.name,
    size: asset.size ?? file.size,
  };
}
