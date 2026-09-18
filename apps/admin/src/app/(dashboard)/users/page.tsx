import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import { getStoredAdminSession } from '@/features/auth/session';
import { UsersList } from '@/features/users/components/users-list';
import { getAdminUsers, getAssignableAdminRoles } from '@/features/users';
import { formatRoleLabel } from '@/features/users/format';
import { hasPermission } from '@/features/auth/permissions';
import { logAdminSessionInDev } from '@/lib/dev/admin-session-log';
import { handleAdminPageError } from '@/lib/server/handle-admin-page-error';
import { isNextNavigationError } from '@/lib/server/is-navigation-error';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المستخدمون',
  description: 'إدارة حسابات المستخدمين والأدوار.',
  path: '/users',
});

const ROLE_CODE_PATTERN = /^[A-Z0-9_]+$/;

/** Display-only fallback options when roles catalog is unavailable. */
const ROLE_FILTER_FALLBACK: Array<{ value: string; label: string }> = [
  { value: 'USER', label: formatRoleLabel('USER') },
  { value: 'BROKER', label: formatRoleLabel('BROKER') },
  { value: 'DEVELOPER', label: formatRoleLabel('DEVELOPER') },
  { value: 'ADMIN', label: formatRoleLabel('ADMIN') },
  { value: 'MODERATOR', label: formatRoleLabel('MODERATOR') },
  { value: 'SUPER_ADMIN', label: formatRoleLabel('SUPER_ADMIN') },
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

function parseRole(value: string | string[] | undefined): string | undefined {
  const raw = parseString(value).toUpperCase();
  if (raw && ROLE_CODE_PATTERN.test(raw)) {
    return raw;
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
  const permissions = session?.user.permissions ?? [];

  logAdminSessionInDev('users:page', stored
    ? {
        user: stored.user,
        hasAccessToken: Boolean(stored.accessToken),
        hasRefreshToken: Boolean(stored.refreshToken),
      }
    : null, {
    roles,
    canViewUsers: hasPermission(permissions, 'users.view'),
  });

  if (!hasPagePermission(permissions, 'users.view')) {
    return <PagePermissionDenied />;
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
  let roleOptions = ROLE_FILTER_FALLBACK;

  try {
    const usersPromise = getAdminUsers({
      page,
      limit,
      search,
      role,
      status,
    });

    if (hasPermission(permissions, 'roles.view')) {
      const [usersResult, catalog] = await Promise.all([
        usersPromise,
        getAssignableAdminRoles(),
      ]);
      result = usersResult;
      if (catalog.length > 0) {
        roleOptions = catalog.map((item) => ({
          value: item.code,
          label: item.name,
        }));
      }
    } else {
      result = await usersPromise;
    }
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    handleAdminPageError(error);
  }

  return (
    <UsersList
      result={result}
      roleOptions={roleOptions}
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
