'use server';

import { getServerSession, withRefreshedAccessToken } from '@/features/auth/session';
import { mapUploadError } from '@/lib/api/errors';
import { uploadPropertyImageFile } from './service';
import type { UploadPropertyImageResult } from './types';

const ACCEPT_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function validateUploadFile(file: File): string | null {
  if (!ACCEPT_TYPES.has(file.type)) {
    return 'صيغة الملف غير مدعومة. استخدم JPG أو PNG أو WebP.';
  }

  if (file.size <= 0) {
    return 'الملف فارغ.';
  }

  if (file.size > MAX_BYTES) {
    return 'حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.';
  }

  return null;
}

export async function uploadPropertyImageAction(
  formData: FormData,
): Promise<UploadPropertyImageResult> {
  const session = await getServerSession();
  if (!session) {
    return { ok: false, error: 'يجب تسجيل الدخول لرفع الصور.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { ok: false, error: 'لم يتم اختيار ملف صالح.' };
  }

  const validationError = validateUploadFile(file);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  try {
    const uploaded = await withRefreshedAccessToken((accessToken) =>
      uploadPropertyImageFile(file, accessToken),
    );
    return { ok: true, data: uploaded };
  } catch (error) {
    return { ok: false, error: mapUploadError(error) };
  }
}
