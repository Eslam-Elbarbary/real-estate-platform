'use server';

import { getAccountService } from './service';
import {
  addContactPhoneSchema,
  updateProfileEmailSchema,
  updateProfileNameSchema,
  updateProfilePasswordSchema,
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

export async function updateProfileNameAction(
  name: string,
): Promise<ActionResult<AccountProfile>> {
  const parsed = updateProfileNameSchema.safeParse({ name });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  const data = await getAccountService().updateProfile({
    name: parsed.data.name,
  });
  return { ok: true, data };
}

export async function updateProfileEmailAction(
  email: string,
): Promise<ActionResult<AccountProfile>> {
  const parsed = updateProfileEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  const data = await getAccountService().updateProfile({
    email: parsed.data.email,
  });
  return { ok: true, data };
}

export async function updateProfilePasswordAction(
  password: string,
): Promise<ActionResult<{ saved: true }>> {
  const parsed = updateProfilePasswordSchema.safeParse({ password });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'بيانات غير صالحة',
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  // Demo-only: accept password change without persistence.
  void parsed.data.password;
  return { ok: true, data: { saved: true } };
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
  const data = await getAccountService().updateProfile({
    phone: parsed.data.phone,
    phoneVerified: true,
  });
  return { ok: true, data };
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
