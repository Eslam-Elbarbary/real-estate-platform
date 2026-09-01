import type { AdminAuthUser } from '@/features/auth/types';

export function logAdminSessionInDev(
  context: string,
  session: {
    user: Pick<AdminAuthUser, 'id' | 'email' | 'roles'>;
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
  } | null,
  extra?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (!session) {
    console.info(`[admin:${context}]`, { session: null, ...extra });
    return;
  }

  console.info(`[admin:${context}]`, {
    userId: session.user.id,
    email: session.user.email,
    roles: session.user.roles,
    hasAccessToken: session.hasAccessToken,
    hasRefreshToken: session.hasRefreshToken,
    ...extra,
  });
}
