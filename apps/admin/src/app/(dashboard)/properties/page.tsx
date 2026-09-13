import { PropertiesList } from '@/features/properties/components/properties-list';
import { getAdminProperties, getPropertyFormCatalogs } from '@/features/properties';
import type { AdminPropertySort } from '@/features/properties';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';
import type { PropertyStatus } from '@/types';

export const metadata = createPageMetadata({
  title: 'العقارات',
  description: 'إدارة العقارات ومراجعات النشر.',
  path: '/properties',
});

const VALID_STATUSES: PropertyStatus[] = [
  'DRAFT',
  'PENDING_PAYMENT',
  'PENDING_REVIEW',
  'PUBLISHED',
  'REJECTED',
  'ARCHIVED',
  'EXPIRED',
];

const VALID_SORTS: AdminPropertySort[] = [
  'newest',
  'oldest',
  'price_asc',
  'price_desc',
];

function parseStatus(
  value: string | string[] | undefined,
): PropertyStatus | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && VALID_STATUSES.includes(raw as PropertyStatus)) {
    return raw as PropertyStatus;
  }
  return undefined;
}

function parseSort(
  value: string | string[] | undefined,
): AdminPropertySort {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && VALID_SORTS.includes(raw as AdminPropertySort)) {
    return raw as AdminPropertySort;
  }
  return 'newest';
}

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const sort = parseSort(params.sort);
  const searchRaw = Array.isArray(params.search) ? params.search[0] : params.search;
  const search = searchRaw?.trim() ?? '';

  const [result, catalogs, session] = await Promise.all([
    getAdminProperties({ status, page, limit, search, sort }),
    getPropertyFormCatalogs(),
    getAdminSession(),
  ]);
  const permissions = session?.user.permissions ?? [];

  return (
    <PropertiesList
      result={result}
      catalogs={catalogs}
      permissions={permissions}
      filters={{ status, page, limit, search, sort }}
    />
  );
}
