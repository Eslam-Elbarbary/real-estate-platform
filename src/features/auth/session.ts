import { cookies } from 'next/headers';
import { DEMO_USER } from './demo-user';
import type { AuthSession } from './types';

/** Non-sensitive demo flag only — never store credentials or PII here. */
export const DEMO_AUTH_COOKIE = 'demo_auth';
export const DEMO_AUTH_VALUE = '1';

export function createDemoSession(): AuthSession {
  return {
    authenticated: true,
    user: DEMO_USER,
  };
}

export async function readDemoAuthCookie(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(DEMO_AUTH_COOKIE)?.value === DEMO_AUTH_VALUE;
}

export async function getServerSession(): Promise<AuthSession | null> {
  const active = await readDemoAuthCookie();
  return active ? createDemoSession() : null;
}

export async function setDemoAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(DEMO_AUTH_COOKIE, DEMO_AUTH_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearDemoAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(DEMO_AUTH_COOKIE);
}
