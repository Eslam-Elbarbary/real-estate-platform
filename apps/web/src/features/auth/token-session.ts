import 'server-only';

import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'web_access_token';
const REFRESH_TOKEN_COOKIE = 'web_refresh_token';
const REMEMBER_ME_COOKIE = 'web_remember_me';

/** Legacy demo flag — cleared on logout for users mid-migration. */
const LEGACY_DEMO_AUTH_COOKIE = 'demo_auth';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

/** @deprecated Prefer StoredTokens */
export type StoredApiTokens = StoredTokens;

function cookieOptions(maxAgeSeconds?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    ...(typeof maxAgeSeconds === 'number' ? { maxAge: maxAgeSeconds } : {}),
  };
}

/** Access JWT cookie TTL (API default access lifetime is ~15m; refresh extends it). */
const ACCESS_TOKEN_MAX_AGE = 60 * 15;

/** Refresh JWT cookie TTL (aligned with API default 7d). */
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export interface SaveTokenOptions {
  /** When false, cookies last for the browser session only. */
  rememberMe?: boolean;
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function isRememberMeEnabled(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(REMEMBER_ME_COOKIE)?.value !== '0';
}

export async function saveTokens(
  tokens: StoredTokens,
  options: SaveTokenOptions = {},
): Promise<void> {
  const persist =
    options.rememberMe !== undefined
      ? options.rememberMe
      : await isRememberMeEnabled();
  const jar = await cookies();
  jar.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    cookieOptions(persist ? ACCESS_TOKEN_MAX_AGE : undefined),
  );
  jar.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    cookieOptions(persist ? REFRESH_TOKEN_MAX_AGE : undefined),
  );
  jar.set(
    REMEMBER_ME_COOKIE,
    persist ? '1' : '0',
    cookieOptions(persist ? REFRESH_TOKEN_MAX_AGE : undefined),
  );
}

export async function clearTokens(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_TOKEN_COOKIE);
  jar.delete(REFRESH_TOKEN_COOKIE);
  jar.delete(REMEMBER_ME_COOKIE);
  jar.delete(LEGACY_DEMO_AUTH_COOKIE);
}

/** @deprecated Prefer getAccessToken */
export async function getApiAccessToken(): Promise<string | null> {
  return getAccessToken();
}

/** @deprecated Prefer saveTokens */
export async function saveApiTokens(tokens: StoredTokens): Promise<void> {
  return saveTokens(tokens);
}

/** @deprecated Prefer clearTokens */
export async function clearApiTokens(): Promise<void> {
  return clearTokens();
}
