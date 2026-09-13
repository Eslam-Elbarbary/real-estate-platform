'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DataTable, type DataTableColumn } from '@/components/data';
import { EmptyState } from '@/components/ui/empty-state';
import { routes } from '@/config/routes';
import { formatDate, formatNumber, formatPrice, formatTypeLabel } from '../format';
import type { Property } from '../types';
import { PropertyActionMenu } from './property-action-menu';
import { PropertyStatusBadge } from './property-status-badge';

interface PropertiesTableProps {
  items: Property[];
  permissions: string[];
}

function formatOwnerLabel(property: Property): string {
  return property.owner.name ?? property.owner.email;
}

function formatLocation(property: Property): string {
  return property.location.summary || '—';
}

function formatDisplayDate(property: Property): string {
  return formatDate(property.publishedAt ?? property.createdAt);
}

function SpecsLine({ property }: { property: Property }) {
  const parts: string[] = [];
  if (property.bedrooms != null) {
    parts.push(`${property.bedrooms.toLocaleString('ar-EG')} غرف`);
  }
  if (property.bathrooms != null) {
    parts.push(`${property.bathrooms.toLocaleString('ar-EG')} حمّام`);
  }
  if (property.areaSqm != null) {
    parts.push(`${property.areaSqm.toLocaleString('ar-EG')} م²`);
  }
  if (parts.length === 0) {
    return null;
  }
  return <p className="mt-0.5 text-xs text-ink-500">{parts.join(' · ')}</p>;
}

export function PropertiesTable({ items, permissions }: PropertiesTableProps) {
  const columns: DataTableColumn<Property>[] = [
    {
      key: 'property',
      label: 'العقار',
      className: 'min-w-[240px]',
      render: (property) => (
        <div className="flex items-start gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-100">
            {property.primaryImage?.url ? (
              <Image
                src={property.primaryImage.url}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[10px] text-ink-400">
                بلا صورة
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={routes.properties.details(property.id)}
              className="line-clamp-2 font-medium text-ink-900 hover:text-brand-700"
            >
              {property.title ?? property.slug}
            </Link>
            <p className="mt-0.5 truncate text-xs text-ink-500" dir="ltr">
              {property.referenceNumber ?? property.slug}
            </p>
            <SpecsLine property={property} />
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'النوع',
      render: (property) => (
        <div className="space-y-0.5">
          <p>{formatTypeLabel(property.propertyType)}</p>
          <p className="text-xs text-ink-500">
            {formatTypeLabel(property.transactionType)}
          </p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'السعر',
      render: (property) => formatPrice(property.price, property.currency),
    },
    {
      key: 'location',
      label: 'الموقع',
      className: 'max-w-[160px]',
      render: (property) => (
        <span className="line-clamp-2 text-sm">{formatLocation(property)}</span>
      ),
    },
    {
      key: 'owner',
      label: 'المالك',
      className: 'max-w-[140px]',
      render: (property) => (
        <div className="min-w-0">
          <p className="truncate">{formatOwnerLabel(property)}</p>
          <p className="truncate text-xs text-ink-500" dir="ltr">
            {property.owner.email}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (property) => <PropertyStatusBadge status={property.status} />,
    },
    {
      key: 'date',
      label: 'التاريخ',
      render: (property) => (
        <div className="space-y-0.5">
          <p className="text-sm">{formatDisplayDate(property)}</p>
          <p className="text-xs text-ink-500">
            {formatNumber(property.viewCount)} مشاهدة ·{' '}
            {formatNumber(property.favoritesCount)} مفضلة
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'إجراء',
      render: (property) => (
        <PropertyActionMenu
          propertyId={property.id}
          status={property.status}
          permissions={permissions}
          compact
        />
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد عقارات"
        description="لا توجد عقارات مطابقة للبحث أو الفلتر الحالي."
        className="m-4 border-0 shadow-none"
      />
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={items}
          emptyMessage="لا توجد عقارات مطابقة للبحث أو الفلتر الحالي."
        />
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {items.map((property) => (
          <article
            key={property.id}
            className="rounded-xl border border-border bg-white p-3 shadow-sm"
          >
            <div className="flex gap-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                {property.primaryImage?.url ? (
                  <Image
                    src={property.primaryImage.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={routes.properties.details(property.id)}
                      className="line-clamp-2 font-medium text-ink-900"
                    >
                      {property.title ?? property.slug}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-500" dir="ltr">
                      {property.referenceNumber ?? property.slug}
                    </p>
                  </div>
                  <PropertyStatusBadge status={property.status} />
                </div>
                <p className="mt-2 text-sm font-medium text-ink-900">
                  {formatPrice(property.price, property.currency)}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-ink-500">
                  {formatLocation(property)}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {formatOwnerLabel(property)} · {formatDisplayDate(property)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end border-t border-border pt-3">
              <PropertyActionMenu
                propertyId={property.id}
                status={property.status}
                permissions={permissions}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
