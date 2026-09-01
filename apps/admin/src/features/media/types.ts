export interface MediaAssetUploader {
  id: string;
  name: string | null;
}

export interface MediaAsset {
  id: string;
  url: string;
  fileName: string | null;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  folder: string | null;
  createdAt: string;
  uploadedBy?: MediaAssetUploader | null;
}

export interface MediaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MediaFilters {
  page?: number;
  limit?: number;
  search?: string;
  folder?: string;
}

export interface MediaListResult {
  items: MediaAsset[];
  meta: MediaPagination;
}

export interface UploadMediaInput {
  files: File[];
  folder?: string;
}

export const MEDIA_FOLDER_OPTIONS = [
  { value: 'aqarmap/library', label: 'aqarmap/library' },
  { value: 'properties', label: 'properties' },
  { value: 'developers', label: 'developers' },
  { value: 'compounds', label: 'compounds' },
] as const;

export const MEDIA_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export const MEDIA_MAX_FILE_BYTES = 5 * 1024 * 1024;
