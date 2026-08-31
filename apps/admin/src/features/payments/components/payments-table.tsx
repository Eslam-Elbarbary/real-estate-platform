import Link from 'next/link';
import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import {
  formatAmount,
  formatDate,
  formatOwnerName,
  formatProvider,
} from '../format';
import type { AdminPayment } from '../types';
import { PaymentStatusBadge } from './payment-status-badge';

interface PaymentsTableProps {
  items: AdminPayment[];
}

const columns: DataTableColumn<AdminPayment>[] = [
  {
    key: 'owner',
    label: 'المستخدم',
    className: 'max-w-[180px]',
    render: (payment) => (
      <div className="truncate">
        <span className="font-medium text-ink-900">
          {formatOwnerName(payment.subscription.owner)}
        </span>
        <p className="truncate text-xs text-ink-500" dir="ltr">
          {payment.subscription.owner.email}
        </p>
      </div>
    ),
  },
  {
    key: 'property',
    label: 'العقار',
    className: 'max-w-[180px]',
    render: (payment) => (
      <span className="truncate">
        {payment.subscription.property.title ?? '—'}
      </span>
    ),
  },
  {
    key: 'plan',
    label: 'الخطة',
    render: (payment) => payment.subscription.plan.name,
  },
  {
    key: 'amount',
    label: 'المبلغ',
    render: (payment) => formatAmount(payment.amount, payment.currency),
  },
  {
    key: 'provider',
    label: 'Payment Provider',
    render: (payment) => (
      <div>
        <span>{formatProvider(payment.provider)}</span>
        {payment.providerRef ? (
          <p className="truncate text-xs text-ink-500" dir="ltr">
            {payment.providerRef}
          </p>
        ) : null}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'الحالة',
    render: (payment) => <PaymentStatusBadge status={payment.status} />,
  },
  {
    key: 'paidAt',
    label: 'تاريخ الدفع',
    render: (payment) => formatDate(payment.paidAt),
  },
  {
    key: 'createdAt',
    label: 'تاريخ الإنشاء',
    render: (payment) => formatDate(payment.createdAt),
  },
  {
    key: 'actions',
    label: 'إجراء',
    render: (payment) => (
      <Link href={routes.payments.details(payment.id)}>
        <Button variant="outline" size="small">
          التفاصيل
        </Button>
      </Link>
    ),
  },
];

export function PaymentsTable({ items }: PaymentsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="لا توجد مدفوعات"
    />
  );
}
