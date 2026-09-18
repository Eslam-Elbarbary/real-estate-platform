'use server';

import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { withRefreshedAccessToken } from '@/features/auth/session';
import { ApiRequestError } from '@/lib/api/errors';
import {
  archiveMyProperty,
  deleteMyPropertyDraft,
  restoreMyProperty,
} from '@/data/repositories/api-property-drafts';

export type MyPropertyLifecycleResult =
  | { ok: true }
  | { ok: false; error: string };

function lifecycleErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) {
    if (error.code === 'UNAUTHORIZED' || error.status === 401) {
      return 'انتهت صلاحية الجلسة. سجّل الدخول مرة أخرى.';
    }
    if (error.status === 403) {
      return 'ليس لديك صلاحية تنفيذ هذا الإجراء.';
    }
    if (error.status === 404) {
      return 'الإعلان غير موجود.';
    }
    if (error.status === 400) {
      return error.message || fallback;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

function revalidateMyProperties() {
  revalidatePath(routes.myProperties);
}

export async function deleteDraftListingAction(
  propertyId: string,
): Promise<MyPropertyLifecycleResult> {
  try {
    await withRefreshedAccessToken((token) =>
      deleteMyPropertyDraft(token, propertyId),
    );
    revalidateMyProperties();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: lifecycleErrorMessage(error, 'تعذر حذف المسودة'),
    };
  }
}

export async function archiveListingAction(
  propertyId: string,
): Promise<MyPropertyLifecycleResult> {
  try {
    await withRefreshedAccessToken((token) =>
      archiveMyProperty(token, propertyId),
    );
    revalidateMyProperties();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: lifecycleErrorMessage(error, 'تعذر أرشفة الإعلان'),
    };
  }
}

export async function restoreListingAction(
  propertyId: string,
): Promise<MyPropertyLifecycleResult> {
  try {
    await withRefreshedAccessToken((token) =>
      restoreMyProperty(token, propertyId),
    );
    revalidateMyProperties();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: lifecycleErrorMessage(error, 'تعذر استرجاع الإعلان'),
    };
  }
}
