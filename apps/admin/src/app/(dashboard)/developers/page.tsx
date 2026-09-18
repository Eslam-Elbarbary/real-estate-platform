import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { DevelopersList } from '@/features/developers/components/developers-list';
import { getAdminDevelopers } from '@/features/developers';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المطورون',
  description: 'إدارة ملفات المطورين.',
  path: '/developers',
});

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function DevelopersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  const roles = session?.user.roles ?? [];
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'developers.view')) {
    return <PagePermissionDenied />;
  }

  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const searchRaw = Array.isArray(params.search) ? params.search[0] : params.search;
  const search = searchRaw?.trim() ?? '';

  const result = await getAdminDevelopers({ page, limit, search });

  return (
    <DevelopersList
      result={result}
      roles={roles}
      permissions={permissions}
      filters={{ page, limit, search }}
    />
  );
}
