import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { formatDate, formatDuration, formatPrice } from '../format';
import type { AdminPlan } from '../types';
import { PlanStatusBadge } from './plan-status-badge';

interface PlansTableProps {
  items: AdminPlan[];
  roles: UserRole[];
  onEdit: (plan: AdminPlan) => void;
}

export function PlansTable({ items, roles, onEdit }: PlansTableProps) {
  const canUpdate = hasPermission(roles, 'plans.update');

  const columns: DataTableColumn<AdminPlan>[] = [
    {
      key: 'code',
      label: 'الرمز',
      render: (plan) => (
        <span className="font-mono text-xs text-ink-800" dir="ltr">
          {plan.code}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'الاسم',
      className: 'font-medium text-ink-900',
      render: (plan) => plan.name,
    },
    {
      key: 'price',
      label: 'السعر',
      render: (plan) => formatPrice(plan.price),
    },
    {
      key: 'duration',
      label: 'المدة',
      render: (plan) => formatDuration(plan.durationDays),
    },
    {
      key: 'subscriptions',
      label: 'الاشتراكات',
      render: (plan) => plan.subscriptionCount.toLocaleString('ar-EG'),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (plan) => <PlanStatusBadge status={plan.status} />,
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإنشاء',
      render: (plan) => formatDate(plan.createdAt),
    },
    {
      key: 'actions',
      label: 'إجراء',
      render: (plan) =>
        canUpdate ? (
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={() => onEdit(plan)}
          >
            تعديل
          </Button>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="لا توجد خطط"
    />
  );
}
