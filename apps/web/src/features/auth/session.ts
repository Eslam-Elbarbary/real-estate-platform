import 'server-only';

import { getJson } from '@/lib/api/client';
import { ApiRequestError } from '@/lib/api/errors';
import { refreshAccessToken } from './refresh';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from './token-session';
import type { AuthSession, AuthUser } from './types';

interface UsersMeResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: string[];
  isEmailVerified: boolean;
}

const ME_PATH = '/api/v1/users/me';
const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;

function isJwtExpired(token: string): boolean {
  const parts = token.split('.');
  if (parts.length < 2) {
    return true;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8'),
    ) as { exp?: unknown };
    if (typeof payload.exp !== 'number') {
      return true;
    }
    return payload.exp * 1000 <= Date.now() + ACCESS_TOKEN_EXPIRY_SKEW_MS;
  } catch {
    return true;
  }
}

function buildDisplayName(
  firstName: string | null,
  lastName: string | null,
  email: string,
): string {
  const full = [firstName, lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
  return full || email;
}

export function mapApiUserToAuthUser(
  me: UsersMeResponse,
  permissions: string[] = [],
): AuthUser {
  return {
    id: me.id,
    email: me.email,
    firstName: me.firstName,
    lastName: me.lastName,
    name: buildDisplayName(me.firstName, me.lastName, me.email),
    phone: me.phone,
    roles: Array.isArray(me.roles) ? me.roles : [],
    permissions,
    avatarUrl: me.avatarUrl,
    isEmailVerified: me.isEmailVerified,
  };
}

async function fetchMe(accessToken: string): Promise<UsersMeResponse> {
  return getJson<UsersMeResponse>(ME_PATH, accessToken);
}

/**
 * Ensures a usable access token: returns the current cookie value, or refreshes
 * when missing/expired (refresh rotates httpOnly cookies when writable).
 */
export async function ensureAccessToken(): Promise<string | null> {
  const existing = await getAccessToken();
  if (existing && !isJwtExpired(existing)) {
    return existing;
  }

  if (!(await getRefreshToken())) {
    return null;
  }

  return refreshAccessToken();
}

/**
 * Runs an authenticated API call, refreshing once on 401.
 */
export async function withRefreshedAccessToken<T>(
  operation: (accessToken: string) => Promise<T>,
): Promise<T> {
  const accessToken = await ensureAccessToken();
  if (!accessToken) {
    throw new ApiRequestError({
      code: 'UNAUTHORIZED',
      message: 'Session required',
      userMessage: 'يجب تسجيل الدخول.',
    });
  }

  try {
    return await operation(accessToken);
  } catch (error) {
    if (
      !(error instanceof ApiRequestError) ||
      (error.code !== 'UNAUTHORIZED' && error.status !== 401)
    ) {
      throw error;
    }
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    throw new ApiRequestError({
      code: 'UNAUTHORIZED',
      message: 'Session expired',
      userMessage: 'انتهت صلاحية الجلسة. سجّل الدخول مرة أخرى.',
    });
  }

  return operation(refreshed);
}

/**
 * Token-backed session. Returns null when tokens are missing or invalid.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  let accessToken = await ensureAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    const me = await fetchMe(accessToken);
    return {
      authenticated: true,
      user: mapApiUserToAuthUser(me),
    };
  } catch (error) {
    if (
      !(error instanceof ApiRequestError) ||
      (error.code !== 'UNAUTHORIZED' && error.status !== 401)
    ) {
      return null;
    }
  }

  accessToken = await refreshAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    const me = await fetchMe(accessToken);
    return {
      authenticated: true,
      user: mapApiUserToAuthUser(me),
    };
  } catch {
    try {
      await clearTokens();
    } catch {
      // ignore cookie write restrictions during RSC
    }
    return null;
  }
}
