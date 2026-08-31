import { cookies } from 'next/headers';
import type { AdminAuthUser } from './types';

const ACCESS_TOKEN_COOKIE = 'admin_access_token';
const REFRESH_TOKEN_COOKIE = 'admin_refresh_token';
const USER_COOKIE = 'admin_user';

export interface StoredAdminSession {
  accessToken: string;
  refreshToken: string;
  user: AdminAuthUser;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

export async function saveAdminSession(session: StoredAdminSession): Promise<void> {
  const cookieStore = await cookies();
  const options = cookieOptions();

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.accessToken, options);
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refreshToken, options);
  cookieStore.set(USER_COOKIE, JSON.stringify(session.user), options);
}

export async function getStoredAdminSession(): Promise<StoredAdminSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  const userRaw = cookieStore.get(USER_COOKIE)?.value;

  if (!accessToken || !refreshToken || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as AdminAuthUser;
    if (!user?.id || !user?.email) {
      return null;
    }

    return { accessToken, refreshToken, user };
  } catch {
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
}
