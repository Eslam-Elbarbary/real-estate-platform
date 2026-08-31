import Link from 'next/link';
import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatDate, formatPrice, formatTypeLabel } from '../format';
import type { Property } from '../types';
import { PropertyStatusBadge } from './property-status-badge';

interface PropertiesTableProps {
  items: Property[];
}

function formatOwnerLabel(property: Property): string {
  return property.owner.name ?? property.owner.email;
}

const columns: DataTableColumn<Property>[] = [
  {
    key: 'title',
    label: 'العنوان',
    className: 'max-w-[220px]',
    render: (property) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-ink-900">
          {property.title ?? property.slug}
        </p>
        <p className="truncate text-xs text-ink-500">{property.slug}</p>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'الحالة',
    render: (property) => <PropertyStatusBadge status={property.status} />,
  },
  {
    key: 'propertyType',
    label: 'النوع',
    render: (property) => formatTypeLabel(property.propertyType),
  },
  {
    key: 'transactionType',
    label: 'نوع المعاملة',
    render: (property) => formatTypeLabel(property.transactionType),
  },
  {
    key: 'location',
    label: 'الموقع',
    className: 'max-w-[180px]',
    render: (property) => (
      <span className="line-clamp-2">{property.location.summary || '—'}</span>
    ),
  },
  {
    key: 'owner',
    label: 'المالك',
    render: (property) => formatOwnerLabel(property),
  },
  {
    key: 'price',
    label: 'السعر',
    render: (property) => formatPrice(property.price, property.currency),
  },
  {
    key: 'createdAt',
    label: 'تاريخ الإنشاء',
    render: (property) => formatDate(property.createdAt),
  },
  {
    key: 'actions',
    label: 'إجراء',
    render: (property) => (
      <Link href={routes.properties.details(property.id)}>
        <Button variant="outline" size="small">
          عرض
        </Button>
      </Link>
    ),
  },
];

export function PropertiesTable({ items }: PropertiesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="لا توجد عقارات مطابقة للبحث أو الفلتر الحالي."
    />
  );
}
