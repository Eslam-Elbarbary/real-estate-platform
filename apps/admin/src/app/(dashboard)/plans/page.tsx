import { PlansList } from '@/features/plans/components/plans-list';
import { getAdminPlans } from '@/features/plans';
import type { PlanStatus } from '@/features/plans/types';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الخطط',
  description: 'إدارة خطط الاشتراك Basic و Premium و Featured.',
  path: '/plans',
});

const VALID_STATUSES: PlanStatus[] = ['ACTIVE', 'INACTIVE'];

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

function parseStatus(value: string | string[] | undefined): PlanStatus | undefined {
  const raw = parseString(value);
  if (raw && VALID_STATUSES.includes(raw as PlanStatus)) {
    return raw as PlanStatus;
  }
  return undefined;
}

export default async function PlansPage({
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
  const statusFilter =
    statusRaw === 'ACTIVE' || statusRaw === 'INACTIVE' ? statusRaw : '';

  const [result, session] = await Promise.all([
    getAdminPlans({ page, limit, search, status }),
    getAdminSession(),
  ]);
  const roles = session?.user.roles ?? [];
  const permissions = session?.user.permissions ?? [];

  return (
    <PlansList
      result={result}
      roles={roles}
      permissions={permissions}
      filters={{ page, limit, search, status: statusFilter }}
    />
  );
}
