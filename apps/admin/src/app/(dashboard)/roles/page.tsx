import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import { getAdminRoles } from '@/features/roles';
import { RolesList } from '@/features/roles/components/roles-list';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الأدوار والصلاحيات',
  description: 'إدارة أدوار النظام وصلاحيات الوصول.',
  path: '/roles',
});

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

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'roles.view')) {
    return <PagePermissionDenied />;
  }

  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const search = parseString(params.search);

  const result = await getAdminRoles({ page, limit, search });

  return (
    <RolesList
      result={result}
      permissions={permissions}
      filters={{ page, limit, search }}
    />
  );
}
