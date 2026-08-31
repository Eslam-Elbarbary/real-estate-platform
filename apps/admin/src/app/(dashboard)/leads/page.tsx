import { LeadsList } from '@/features/leads/components/leads-list';
import { getAdminLeads } from '@/features/leads';
import type { LeadStatus } from '@/features/leads/types';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الطلبات',
  description: 'متابعة طلبات التواصل والاستفسارات على العقارات.',
  path: '/leads',
});

const VALID_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'FOLLOW_UP',
  'INTERESTED',
  'CLOSED',
  'REJECTED',
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

function parseStatus(
  value: string | string[] | undefined,
): LeadStatus | undefined {
  const raw = parseString(value);
  if (raw && VALID_STATUSES.includes(raw as LeadStatus)) {
    return raw as LeadStatus;
  }
  return undefined;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const search = parseString(params.search);
  const status = parseStatus(params.status);
  const statusRaw = Array.isArray(params.status) ? params.status[0] : params.status;
  const statusFilter = VALID_STATUSES.includes(statusRaw as LeadStatus)
    ? (statusRaw as LeadStatus)
    : '';

  const result = await getAdminLeads({ page, limit, search, status });

  return (
    <LeadsList
      result={result}
      filters={{ page, limit, search, status: statusFilter }}
    />
  );
}
