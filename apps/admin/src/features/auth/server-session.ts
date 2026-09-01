import 'server-only';

import { headers } from 'next/headers';
import { env } from '@/config/env';
import { logAdminErrorInDev } from '@/lib/dev/admin-log';
import { refreshAccessToken } from './refresh';
import {
  clearAdminSession,
  getStoredAdminSession,
  saveAdminSession,
} from './session';

interface RefreshRouteBody {
  success?: boolean;
  accessToken?: string;
}

async function resolveAdminAppUrl(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');

  if (host) {
    const protocol = headerStore.get('x-forwarded-proto') ?? 'http';
    return `${protocol}://${host}`;
  }

  return env.adminUrl;
}

/**
 * Refreshes tokens with the backend and persists HttpOnly session cookies.
 * Safe in Route Handlers; do not call from Server Components (use the refresh route).
 */
export async function persistRefreshedAdminSession(): Promise<string | false> {
  const session = await getStoredAdminSession();

  if (!session?.refreshToken) {
    logAdminErrorInDev('auth:persist-refresh', new Error('No refresh token in session'));
    return false;
  }

  const refreshed = await refreshAccessToken(session.refreshToken);

  if (!refreshed) {
    logAdminErrorInDev('auth:persist-refresh', new Error('Backend refresh rejected token'));
    await clearAdminSession();
    return false;
  }

  await saveAdminSession({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    user: refreshed.user,
  });

  return refreshed.accessToken;
}

/**
 * Server-side token refresh via the Route Handler so cookie writes happen
 * in an allowed context during RSC data fetching.
 */
export async function requestRefreshedAccessToken(): Promise<string | false> {
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie');

  if (!cookieHeader) {
    logAdminErrorInDev('auth:refresh-route', new Error('No cookie header on incoming request'));
    return false;
  }

  const refreshUrl = new URL('/api/auth/refresh', await resolveAdminAppUrl());

  let response: Response;
  try {
    response = await fetch(refreshUrl, {
      method: 'POST',
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
  } catch (error) {
    logAdminErrorInDev('auth:refresh-route', error, { url: refreshUrl.toString() });
    return false;
  }

  if (!response.ok) {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = undefined;
    }

    logAdminErrorInDev('auth:refresh-route', new Error('Refresh route returned non-OK status'), {
      status: response.status,
      details,
    });
    return false;
  }

  const body = (await response.json()) as RefreshRouteBody;
  if (!body.accessToken) {
    logAdminErrorInDev('auth:refresh-route', new Error('Refresh route missing accessToken'));
    return false;
  }

  return body.accessToken;
}
