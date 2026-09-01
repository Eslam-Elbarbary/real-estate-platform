import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminSession } from '@/features/auth/service';
import { MediaLibrary } from '@/features/media/components/media-library';
import { getAdminMedia } from '@/features/media';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الوسائط',
  description: 'إدارة جميع الصور والملفات المستخدمة داخل المنصة.',
  path: '/media',
});

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseStringParam(
  value: string | string[] | undefined,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? '';
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  const roles = session?.user.roles ?? [];

  if (!hasPermission(roles, 'media.view')) {
    redirect(routes.forbidden);
  }

  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const search = parseStringParam(params.search);
  const folder = parseStringParam(params.folder);

  const result = await getAdminMedia({ page, limit, search, folder });

  return (
    <MediaLibrary
      result={result}
      roles={roles}
      filters={{ page, limit, search, folder }}
    />
  );
}
