import { PropertiesList } from '@/features/properties/components/properties-list';
import { getAdminProperties } from '@/features/properties';
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

function parseStatus(value: string | string[] | undefined): PropertyStatus {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && VALID_STATUSES.includes(raw as PropertyStatus)) {
    return raw as PropertyStatus;
  }
  return 'PENDING_REVIEW';
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
  const searchRaw = Array.isArray(params.search) ? params.search[0] : params.search;
  const search = searchRaw?.trim() ?? '';

  const result = await getAdminProperties({ status, page, limit, search });

  return (
    <PropertiesList
      result={result}
      filters={{ status, page, limit, search }}
    />
  );
}
