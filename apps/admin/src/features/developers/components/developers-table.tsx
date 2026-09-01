import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { formatDate, formatDeveloperName } from '../format';
import type { Developer } from '../types';
import { DeveloperStatusBadge } from './developer-status-badge';

interface DevelopersTableProps {
  items: Developer[];
  roles: UserRole[];
  onEdit: (developer: Developer) => void;
}

export function DevelopersTable({ items, roles, onEdit }: DevelopersTableProps) {
  const canUpdate = hasPermission(roles, 'developers.update');

  const columns: DataTableColumn<Developer>[] = [
    {
      key: 'logo',
      label: 'الشعار',
      render: (developer) =>
        developer.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={developer.logoUrl}
            alt={formatDeveloperName(developer)}
            className="size-10 rounded-md border border-border object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-surface-100 text-xs font-semibold text-ink-500">
            {formatDeveloperName(developer).slice(0, 1)}
          </div>
        ),
    },
    {
      key: 'name',
      label: 'الاسم',
      className: 'max-w-[220px]',
      render: (developer) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-900">
            {formatDeveloperName(developer)}
          </p>
          <p className="truncate text-xs text-ink-500">{developer.slug}</p>
        </div>
      ),
    },
    {
      key: 'website',
      label: 'الموقع',
      className: 'max-w-[180px]',
      render: (developer) =>
        developer.website ? (
          <a
            href={developer.website}
            target="_blank"
            rel="noreferrer"
            className="truncate text-brand-700 hover:underline"
            dir="ltr"
          >
            {developer.website}
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'compoundCount',
      label: 'عدد المشاريع',
      render: (developer) => developer.compoundCount.toLocaleString('ar-EG'),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (developer) => (
        <DeveloperStatusBadge isActive={developer.isActive} />
      ),
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإنشاء',
      render: (developer) => formatDate(developer.createdAt),
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (developer) =>
        canUpdate ? (
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={() => onEdit(developer)}
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
      emptyMessage="لا توجد مطورون"
    />
  );
}
