'use server';

import { createPropertyLeadFromApi } from '@/data/repositories/api-leads';
import { withRefreshedAccessToken } from '@/features/auth/session';
import { ApiRequestError } from '@/lib/api/errors';

export type CreateLeadActionResult =
  | { ok: true }
  | { ok: false; error: string; code?: 'UNAUTHORIZED' | 'ERROR' };

/**
 * Fire-and-forget friendly: callers should not block contact navigation
 * on the result. Guests / auth failures return ok:false without throwing.
 */
export async function createPropertyLeadAction(
  propertyId: string,
  type: 'PHONE' | 'WHATSAPP',
  message?: string,
): Promise<CreateLeadActionResult> {
  const id = propertyId?.trim();
  if (!id) {
    return { ok: false, error: 'معرّف العقار غير صالح', code: 'ERROR' };
  }

  try {
    await withRefreshedAccessToken((accessToken) =>
      createPropertyLeadFromApi(
        id,
        {
          type,
          ...(message?.trim() ? { message: message.trim() } : {}),
        },
        accessToken,
      ),
    );
    return { ok: true };
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      return {
        ok: false,
        error: 'يجب تسجيل الدخول لتسجيل الاهتمام.',
        code: 'UNAUTHORIZED',
      };
    }
    return {
      ok: false,
      error: 'تعذر تسجيل طلب التواصل.',
      code: 'ERROR',
    };
  }
}
