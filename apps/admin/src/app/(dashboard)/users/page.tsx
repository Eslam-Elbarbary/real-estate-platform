import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminSession } from '@/features/auth/service';
import { getStoredAdminSession } from '@/features/auth/session';
import { UsersList } from '@/features/users/components/users-list';
import { getAdminUsers } from '@/features/users';
import { logAdminSessionInDev } from '@/lib/dev/admin-session-log';
import { handleAdminPageError } from '@/lib/server/handle-admin-page-error';
import { isNextNavigationError } from '@/lib/server/is-navigation-error';
import { createPageMetadata } from '@/lib/seo/metadata';
import type { UserRole } from '@/types';

export const metadata = createPageMetadata({
  title: 'المستخدمون',
  description: 'إدارة حسابات المستخدمين والأدوار.',
  path: '/users',
});

const VALID_ROLES: UserRole[] = [
  'USER',
  'BROKER',
  'DEVELOPER',
  'ADMIN',
  'MODERATOR',
  'SUPER_ADMIN',
];

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseString(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? '';
}

function parseRole(value: string | string[] | undefined): UserRole | undefined {
  const raw = parseString(value);
  if (raw && VALID_ROLES.includes(raw as UserRole)) {
    return raw as UserRole;
  }
  return undefined;
}

function parseStatus(value: string | string[] | undefined): boolean | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'true') {
    return true;
  }
  if (raw === 'false') {
    return false;
  }
  return undefined;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  const stored = await getStoredAdminSession();
  const roles = session?.user.roles ?? [];

  logAdminSessionInDev('users:page', stored
    ? {
        user: stored.user,
        hasAccessToken: Boolean(stored.accessToken),
        hasRefreshToken: Boolean(stored.refreshToken),
      }
    : null, {
    roles,
    canViewUsers: hasPermission(roles, 'users.view'),
  });

  if (!hasPermission(roles, 'users.view')) {
    redirect(routes.forbidden);
  }

  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const search = parseString(params.search);
  const role = parseRole(params.role);
  const status = parseStatus(params.status);
  const statusRaw = Array.isArray(params.status) ? params.status[0] : params.status;
  const statusFilter =
    statusRaw === 'true' || statusRaw === 'false' ? statusRaw : '';

  let result;

  try {
    result = await getAdminUsers({
      page,
      limit,
      search,
      role,
      status,
    });
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    handleAdminPageError(error);
  }

  return (
    <UsersList
      result={result}
      filters={{
        page,
        limit,
        search,
        role: role ?? '',
        status: statusFilter,
      }}
    />
  );
}
