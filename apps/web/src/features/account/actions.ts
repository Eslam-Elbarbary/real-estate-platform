'use server';

import { getAccountService } from './service';
import { logoutAction } from '@/features/auth/actions';
import { ApiRequestError } from '@/lib/api/errors';
import {
  addContactPhoneSchema,
  changePasswordSchema,
  updateProfileNameSchema,
  updateProfilePhoneSchema,
} from './schemas';
import type { AccountProfile, AdvertisingContactPhone } from './types';

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function mapAccountApiError(
  error: unknown,
  context: 'profile' | 'password' = 'profile',
): ActionResult<never> {
  if (error instanceof ApiRequestError) {
    if (error.code === 'UNAUTHORIZED' || error.status === 401) {
      if (context === 'password') {
        return {
          ok: false,
          error: 'كلمة المرور الحالية غير صحيحة',
          fieldErrors: { currentPassword: 'كلمة المرور الحالية غير صحيحة' },
        };
      }
      return { ok: false, error: 'انتهت صلاحية الجلسة. سجّل الدخول مرة أخرى.' };
    }
    if (error.code === 'NETWORK') {
      return { ok: false, error: error.userMessage };
    }
    return {
      ok: false,
      error: error.message || 'تعذر حفظ التغييرات. حاول مرة أخرى.',
    };
  }
  return {
    ok: false,
    error: error instanceof Error ? error.message : 'تعذر حفظ التغييرات',
  };
}

export async function updateProfileNameAction(
  firstName: string,
  lastName: string,
): Promise<ActionResult<AccountProfile>> {
  const parsed = updateProfileNameSchema.safeParse({ firstName, lastName });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  try {
    const data = await getAccountService().updateProfile({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    });
    return { ok: true, data };
  } catch (error) {
    return mapAccountApiError(error);
  }
}

export async function updateProfilePhoneAction(
  phone: string,
): Promise<ActionResult<AccountProfile>> {
  const parsed = updateProfilePhoneSchema.safeParse({ phone });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  try {
    const data = await getAccountService().updateProfile({
      phone: parsed.data.phone,
    });
    return { ok: true, data };
  } catch (error) {
    return mapAccountApiError(error);
  }
}

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult<{ saved: true }>> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  try {
    await getAccountService().changePassword({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });
    await logoutAction();
    return { ok: true, data: { saved: true } };
  } catch (error) {
    return mapAccountApiError(error, 'password');
  }
}

function normalizeEgyptNationalPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('20')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = `0${digits}`;
  }
  return digits;
}

export async function addContactPhoneAction(
  phone: string,
): Promise<ActionResult<AdvertisingContactPhone>> {
  const parsed = addContactPhoneSchema.safeParse({
    phone: normalizeEgyptNationalPhone(phone),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  try {
    const data = await getAccountService().addContactPhone(parsed.data.phone);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'تعذر إضافة الرقم',
    };
  }
}

export async function removeContactPhoneAction(
  id: string,
): Promise<ActionResult<{ removed: true }>> {
  await getAccountService().removeContactPhone(id);
  return { ok: true, data: { removed: true } };
}

export async function setWhatsAppEnabledAction(
  id: string,
  enabled: boolean,
): Promise<ActionResult<AdvertisingContactPhone>> {
  try {
    const data = await getAccountService().setWhatsAppEnabled(id, enabled);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'تعذر تحديث واتساب',
    };
  }
}
