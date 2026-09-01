import { deleteMedia, getMedia, uploadMedia } from './repository';
import type {
  MediaFilters,
  MediaListResult,
  UploadMediaInput,
} from './types';
import type { MediaAsset } from './types';

export async function getAdminMedia(
  filters: MediaFilters = {},
): Promise<MediaListResult> {
  return getMedia({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    folder: filters.folder?.trim() || undefined,
  });
}

export async function uploadAdminMedia(
  input: UploadMediaInput,
): Promise<MediaAsset[]> {
  if (!input.files.length) {
    throw new Error('At least one file is required');
  }

  return uploadMedia(input.files, input.folder?.trim() || undefined);
}

export async function deleteAdminMedia(id: string): Promise<{ message: string }> {
  return deleteMedia(id);
}
