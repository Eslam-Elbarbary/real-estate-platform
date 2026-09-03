'use server';

import { logMediaUploadInDev } from '@/lib/dev/media-upload-log';
import { AdminError, getUserFacingErrorMessage } from '@/lib/errors';
import { isNextNavigationError } from '@/lib/server/is-navigation-error';
import { deleteAdminMedia, getAdminMedia, uploadAdminMedia } from './service';
import {
  MEDIA_IMAGE_MIME_TYPES,
  MEDIA_MAX_FILE_BYTES,
  type MediaAsset,
  type MediaFilters,
  type MediaListResult,
} from './types';

export type MediaActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type UploadMediaActionResult =
  | { ok: true; data: MediaAsset[] }
  | { ok: false; error: string };

export type ListMediaActionResult =
  | { ok: true; data: MediaListResult }
  | { ok: false; error: string };

function rethrowNavigationError(error: unknown): void {
  if (isNextNavigationError(error)) {
    throw error;
  }
}

function formatActionError(error: unknown): string {
  if (error instanceof AdminError) {
    return error.userMessage;
  }
  return getUserFacingErrorMessage(error);
}

export async function listMediaAction(
  filters: MediaFilters,
): Promise<ListMediaActionResult> {
  try {
    const data = await getAdminMedia(filters);
    return { ok: true, data };
  } catch (error) {
    rethrowNavigationError(error);
    return { ok: false, error: formatActionError(error) };
  }
}

function extractFiles(formData: FormData): File[] {
  return formData
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function validateFiles(files: File[]): string | null {
  for (const file of files) {
    if (!MEDIA_IMAGE_MIME_TYPES.has(file.type)) {
      return 'نوع الملف غير مدعوم. المسموح: JPEG و PNG و WebP.';
    }

    if (file.size > MEDIA_MAX_FILE_BYTES) {
      return 'حجم الملف يجب ألا يتجاوز 5 م.ب.';
    }
  }

  return null;
}

export async function uploadMediaAction(
  formData: FormData,
): Promise<UploadMediaActionResult> {
  logMediaUploadInDev('action-start', { phase: 'uploadMediaAction' });

  try {
    const files = extractFiles(formData);
    const validationError = validateFiles(files);
    const folder = formData.get('folder');

    logMediaUploadInDev('files-received', {
      count: files.length,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      folder: typeof folder === 'string' ? folder : undefined,
    });

    if (!files.length) {
      return { ok: false, error: 'يجب اختيار ملف واحد على الأقل.' };
    }

    if (validationError) {
      return { ok: false, error: validationError };
    }

    logMediaUploadInDev('before-api', {
      endpoint: '/api/v1/admin/media/upload',
      fileCount: files.length,
    });

    const data = await uploadAdminMedia({
      files,
      folder: typeof folder === 'string' ? folder : undefined,
    });

    logMediaUploadInDev('success', {
      count: data.length,
      ids: data.map((asset) => asset.id),
    });

    return { ok: true, data };
  } catch (error) {
    rethrowNavigationError(error);
    logMediaUploadInDev('failure', {
      error: error instanceof Error ? error.message : String(error),
      code: error instanceof AdminError ? error.code : undefined,
      status: error instanceof AdminError ? error.status : undefined,
    });
    return { ok: false, error: formatActionError(error) };
  }
}

export async function deleteMediaAction(id: string): Promise<MediaActionResult> {
  try {
    await deleteAdminMedia(id);
    return { ok: true };
  } catch (error) {
    rethrowNavigationError(error);
    return { ok: false, error: formatActionError(error) };
  }
}
