import Link from 'next/link';
import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatDate, formatLeadType, formatUserName } from '../format';
import type { AdminLead } from '../types';
import { LeadStatusBadge } from './lead-status-badge';

interface LeadsTableProps {
  items: AdminLead[];
}

const columns: DataTableColumn<AdminLead>[] = [
  {
    key: 'buyer',
    label: 'العميل',
    className: 'max-w-[180px]',
    render: (lead) => (
      <div className="truncate">
        <span className="font-medium text-ink-900">
          {formatUserName(lead.buyer)}
        </span>
        <p className="truncate text-xs text-ink-500" dir="ltr">
          {lead.buyer.email}
        </p>
      </div>
    ),
  },
  {
    key: 'property',
    label: 'العقار',
    className: 'max-w-[180px]',
    render: (lead) => (
      <span className="truncate">{lead.property.title ?? '—'}</span>
    ),
  },
  {
    key: 'phone',
    label: 'الهاتف',
    render: (lead) => lead.phone ?? '—',
  },
  {
    key: 'email',
    label: 'البريد',
    className: 'max-w-[180px]',
    render: (lead) => (
      <span className="truncate" dir="ltr">
        {lead.email ?? '—'}
      </span>
    ),
  },
  {
    key: 'type',
    label: 'نوع الطلب',
    render: (lead) => formatLeadType(lead.type),
  },
  {
    key: 'status',
    label: 'الحالة',
    render: (lead) => <LeadStatusBadge status={lead.status} />,
  },
  {
    key: 'createdAt',
    label: 'التاريخ',
    render: (lead) => formatDate(lead.createdAt),
  },
  {
    key: 'actions',
    label: 'إجراء',
    render: (lead) => (
      <Link href={routes.leads.details(lead.id)}>
        <Button variant="outline" size="small">
          التفاصيل
        </Button>
      </Link>
    ),
  },
];

export function LeadsTable({ items }: LeadsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="لا توجد طلبات عملاء"
    />
  );
}
