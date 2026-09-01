'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
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

export async function listMediaAction(
  filters: MediaFilters,
): Promise<ListMediaActionResult> {
  try {
    const data = await getAdminMedia(filters);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
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
  try {
    const files = extractFiles(formData);
    const validationError = validateFiles(files);

    if (!files.length) {
      return { ok: false, error: 'يجب اختيار ملف واحد على الأقل.' };
    }

    if (validationError) {
      return { ok: false, error: validationError };
    }

    const folder = formData.get('folder');
    const data = await uploadAdminMedia({
      files,
      folder: typeof folder === 'string' ? folder : undefined,
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deleteMediaAction(id: string): Promise<MediaActionResult> {
  try {
    await deleteAdminMedia(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
