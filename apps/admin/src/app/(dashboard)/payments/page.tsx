import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PaymentsList } from '@/features/payments/components/payments-list';
import { getAdminPayments } from '@/features/payments';
import type { PaymentStatus } from '@/features/payments/types';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المدفوعات',
  description: 'متابعة المدفوعات والفواتير.',
  path: '/payments',
});

const VALID_STATUSES: PaymentStatus[] = [
  'SUCCESS',
  'PENDING',
  'FAILED',
  'REFUNDED',
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
): PaymentStatus | undefined {
  const raw = parseString(value);
  if (raw && VALID_STATUSES.includes(raw as PaymentStatus)) {
    return raw as PaymentStatus;
  }
  return undefined;
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'payments.view')) {
    return <PagePermissionDenied />;
  }

  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const search = parseString(params.search);
  const status = parseStatus(params.status);
  const statusRaw = Array.isArray(params.status) ? params.status[0] : params.status;
  const statusFilter =
    statusRaw === 'SUCCESS' ||
    statusRaw === 'PENDING' ||
    statusRaw === 'FAILED' ||
    statusRaw === 'REFUNDED'
      ? statusRaw
      : '';

  const result = await getAdminPayments({ page, limit, search, status });

  return (
    <PaymentsList
      result={result}
      filters={{ page, limit, search, status: statusFilter }}
    />
  );
}
