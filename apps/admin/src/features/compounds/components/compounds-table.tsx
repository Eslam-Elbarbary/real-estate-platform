import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import type { Developer } from '@/features/developers/types';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { formatCompoundName, formatDate } from '../format';
import type { Compound } from '../types';
import { CompoundStatusBadge } from './compound-status-badge';

interface CompoundsTableProps {
  items: Compound[];
  developersById: Map<string, Developer>;
  roles: UserRole[];
  onEdit: (compound: Compound) => void;
}

function formatDeveloperLabel(
  developerId: string | null,
  developersById: Map<string, Developer>,
): string {
  if (!developerId) {
    return '—';
  }

  const developer = developersById.get(developerId);
  if (!developer) {
    return developerId;
  }

  return developer.nameAr ?? developer.nameEn;
}

export function CompoundsTable({
  items,
  developersById,
  roles,
  onEdit,
}: CompoundsTableProps) {
  const canUpdate = hasPermission(roles, 'compounds.update');

  const columns: DataTableColumn<Compound>[] = [
    {
      key: 'cover',
      label: 'الغلاف',
      render: (compound) =>
        compound.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={compound.coverUrl}
            alt={formatCompoundName(compound)}
            className="size-10 rounded-md border border-border object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-surface-100 text-xs font-semibold text-ink-500">
            {formatCompoundName(compound).slice(0, 1)}
          </div>
        ),
    },
    {
      key: 'name',
      label: 'الاسم',
      className: 'max-w-[220px]',
      render: (compound) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-900">
            {formatCompoundName(compound)}
          </p>
          <p className="truncate text-xs text-ink-500">{compound.slug}</p>
        </div>
      ),
    },
    {
      key: 'developer',
      label: 'المطور',
      className: 'max-w-[180px]',
      render: (compound) => (
        <span className="line-clamp-2">
          {formatDeveloperLabel(compound.developerId, developersById)}
        </span>
      ),
    },
    {
      key: 'propertyCount',
      label: 'العقارات المنشورة',
      render: (compound) =>
        compound.publishedPropertyCount.toLocaleString('ar-EG'),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (compound) => (
        <CompoundStatusBadge isActive={compound.isActive} />
      ),
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإنشاء',
      render: (compound) => formatDate(compound.createdAt),
    },
    {
      key: 'actions',
      label: 'إجراء',
      render: (compound) =>
        canUpdate ? (
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={() => onEdit(compound)}
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
      emptyMessage="لا توجد مشاريع"
    />
  );
}
