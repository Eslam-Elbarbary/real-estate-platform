'use server';

import { clearDemoAuthCookie, getServerSession, setDemoAuthCookie } from './session';
import type {
  AuthSession,
  LoginCredentialsInput,
  MagicLinkInput,
  RegisterInput,
} from './types';
import {
  RESERVED_DEMO_EMAILS,
  RESERVED_DEMO_PHONES,
  registerSchema,
} from './schemas';

export async function getSessionAction(): Promise<AuthSession | null> {
  return getServerSession();
}

export async function loginWithCredentialsAction(
  input: LoginCredentialsInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.identifier.trim() || !input.password.trim()) {
    return { ok: false, error: 'بيانات الدخول غير مكتملة' };
  }

  await setDemoAuthCookie();
  return { ok: true };
}

export async function loginWithMagicLinkAction(
  _input: MagicLinkInput,
): Promise<{ ok: true }> {
  void _input;
  return { ok: true };
}

export async function registerAction(
  input: RegisterInput,
): Promise<{ ok: true } | { ok: false; fieldErrors: Record<string, string> }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const fieldErrors: Record<string, string> = {};
  if (RESERVED_DEMO_EMAILS.has(parsed.data.email.toLowerCase())) {
    fieldErrors.email = 'هذا البريد الإلكتروني مسجّل بالفعل';
  }
  if (RESERVED_DEMO_PHONES.has(parsed.data.phone)) {
    fieldErrors.phone = 'رقم الهاتف مسجّل بالفعل';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true };
}

export async function completeDemoSessionAction(): Promise<void> {
  await setDemoAuthCookie();
}

export async function logoutAction(): Promise<void> {
  await clearDemoAuthCookie();
}
