'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { refreshAdminSession } from './refresh';
import { getAuthService } from './service';
import type { AdminAuthSession, AdminLoginInput, AuthActionResult } from './types';

export async function getSessionAction(): Promise<AdminAuthSession | null> {
  return getAuthService().getSession();
}

export async function loginAction(
  input: AdminLoginInput,
): Promise<AuthActionResult> {
  try {
    await getAuthService().login(input);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function logoutAction(): Promise<AuthActionResult> {
  try {
    await getAuthService().logout();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function refreshAdminSessionAction(): Promise<string | false> {
  return refreshAdminSession();
}
