'use server';

import { getServerSession } from './session';
import {
  loginWithApi,
  registerWithApi,
  verifyEmailWithApi,
  forgotPasswordWithApi,
  resetPasswordWithApi,
} from './api-login';
import { revokeRefreshToken } from './refresh';
import { clearTokens, saveTokens } from './token-session';
import { mapUploadError, ApiRequestError } from '@/lib/api/errors';
import type { AuthSession, LoginCredentialsInput, RegisterInput } from './types';
import {
  loginCredentialsSchema,
  registerSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './schemas';

export type RegisterActionResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; error?: string };

export type VerifyEmailActionResult =
  | { ok: true }
  | { ok: false; error: string };

function mapLoginError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === 'UNAUTHORIZED') {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
    if (error.code === 'NETWORK') {
      return error.userMessage;
    }
    return error.userMessage || 'تعذر تسجيل الدخول. حاول مرة أخرى.';
  }

  return mapUploadError(error);
}

function mapRegisterApiError(error: unknown): RegisterActionResult {
  if (error instanceof ApiRequestError) {
    if (error.status === 409) {
      return {
        ok: false,
        fieldErrors: { email: 'هذا البريد الإلكتروني مسجّل بالفعل' },
      };
    }

    if (error.code === 'NETWORK') {
      return { ok: false, error: error.userMessage };
    }

    if (error.status === 400 || error.code === 'VALIDATION') {
      const lower = error.message.toLowerCase();
      if (lower.includes('email')) {
        return { ok: false, fieldErrors: { email: 'البريد الإلكتروني غير صالح' } };
      }
      if (lower.includes('password')) {
        return {
          ok: false,
          fieldErrors: {
            password: 'كلمة المرور يجب ألا تقل عن 8 أحرف وتشمل حرفًا ورقمًا',
          },
        };
      }
      if (lower.includes('firstname') || lower.includes('first name')) {
        return { ok: false, fieldErrors: { firstName: 'الاسم الأول غير صالح' } };
      }
      if (lower.includes('lastname') || lower.includes('last name')) {
        return { ok: false, fieldErrors: { lastName: 'اسم العائلة غير صالح' } };
      }
      if (lower.includes('phone')) {
        return { ok: false, fieldErrors: { phone: 'رقم الهاتف غير صالح' } };
      }
      return { ok: false, error: 'بيانات التسجيل غير صالحة. راجع الحقول ثم أعد المحاولة.' };
    }

    if (error.code === 'SERVER') {
      return { ok: false, error: 'تعذر إنشاء الحساب حالياً. حاول مرة أخرى.' };
    }

    return { ok: false, error: error.userMessage || 'تعذر إنشاء الحساب. حاول مرة أخرى.' };
  }

  return { ok: false, error: mapUploadError(error) };
}

export async function getSessionAction(): Promise<AuthSession | null> {
  return getServerSession();
}

export async function loginAction(
  input: LoginCredentialsInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = loginCredentialsSchema.safeParse({
    email: input.email,
    password: input.password,
    rememberMe: input.rememberMe,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'بيانات الدخول غير مكتملة',
    };
  }

  try {
    const tokens = await loginWithApi(parsed.data.email, parsed.data.password);
    await saveTokens(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      { rememberMe: parsed.data.rememberMe !== false },
    );
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: mapLoginError(error),
    };
  }
}

/** @deprecated Prefer loginAction */
export async function loginWithCredentialsAction(
  input: LoginCredentialsInput & { identifier?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email?.trim() || input.identifier?.trim() || '';
  return loginAction({
    email,
    password: input.password,
    rememberMe: input.rememberMe,
  });
}

export async function registerAction(
  input: RegisterInput,
): Promise<RegisterActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const phone = parsed.data.phone?.trim();

  try {
    await registerWithApi({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      password: parsed.data.password,
      ...(phone ? { phone } : {}),
    });
    return { ok: true };
  } catch (error) {
    return mapRegisterApiError(error);
  }
}

export async function verifyEmailAction(
  token: string,
): Promise<VerifyEmailActionResult> {
  const parsed = verifyEmailSchema.safeParse({ token });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'رابط التفعيل غير صالح',
    };
  }

  try {
    await verifyEmailWithApi(parsed.data.token);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      if (error.status === 401 || error.code === 'UNAUTHORIZED') {
        return { ok: false, error: 'رابط التفعيل غير صالح أو منتهٍ.' };
      }
      if (error.code === 'NETWORK') {
        return { ok: false, error: error.userMessage };
      }
      return {
        ok: false,
        error: 'تعذر تأكيد البريد الإلكتروني. حاول مرة أخرى أو اطلب رابطًا جديدًا.',
      };
    }

    return { ok: false, error: mapUploadError(error) };
  }
}

export async function forgotPasswordAction(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'البريد الإلكتروني غير صالح',
    };
  }

  try {
    await forgotPasswordWithApi(parsed.data.email);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      if (error.code === 'NETWORK') {
        return { ok: false, error: error.userMessage };
      }
      if (error.code === 'VALIDATION' || error.status === 400) {
        return { ok: false, error: 'البريد الإلكتروني غير صالح' };
      }
      return { ok: false, error: 'تعذر إرسال تعليمات إعادة التعيين. حاول مرة أخرى.' };
    }
    return { ok: false, error: mapUploadError(error) };
  }
}

export async function resetPasswordAction(input: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة',
      fieldErrors,
    };
  }

  try {
    await resetPasswordWithApi(parsed.data.token, parsed.data.password);
    try {
      await clearTokens();
    } catch {
      // ignore cookie write restrictions
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      if (error.status === 401 || error.code === 'UNAUTHORIZED') {
        return { ok: false, error: 'رابط إعادة التعيين غير صالح أو منتهٍ.' };
      }
      if (error.code === 'NETWORK') {
        return { ok: false, error: error.userMessage };
      }
      return { ok: false, error: 'تعذر إعادة تعيين كلمة المرور. حاول مرة أخرى.' };
    }
    return { ok: false, error: mapUploadError(error) };
  }
}

export async function logoutAction(): Promise<void> {
  await revokeRefreshToken();
}
