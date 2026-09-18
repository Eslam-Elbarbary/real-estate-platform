'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import { hasPermission } from '@/features/auth/permissions';
import type { PropertyStatus } from '@/types';
import { applyClientPropertyFilters } from '../client-filters';
import type {
  AdminPropertiesListResult,
  AdminPropertySort,
  PropertyFormCatalogs,
} from '../types';
import { PropertiesBulkToolbar } from './properties-bulk-toolbar';
import { PropertiesFilters } from './properties-filters';
import { PropertiesStatusCards } from './properties-status-cards';
import { PropertiesTable } from './properties-table';

interface PropertiesListProps {
  result: AdminPropertiesListResult;
  catalogs: PropertyFormCatalogs;
  permissions: string[];
  filters: {
    status?: PropertyStatus;
    page: number;
    limit: number;
    search: string;
    sort: AdminPropertySort;
    propertyTypeId: string;
    transactionTypeId: string;
    location: string;
    owner: string;
    dateFrom: string;
    dateTo: string;
  };
}

export function PropertiesList({
  result,
  catalogs,
  permissions,
  filters,
}: PropertiesListProps) {
  const { items, meta } = result;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const canCreate = hasPermission(permissions, 'properties.create');

  const visibleItems = useMemo(
    () =>
      applyClientPropertyFilters(items, {
        propertyTypeId: filters.propertyTypeId || undefined,
        transactionTypeId: filters.transactionTypeId || undefined,
        location: filters.location || undefined,
        owner: filters.owner || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      }),
    [items, filters],
  );

  useEffect(() => {
    setSelectedIds(new Set());
  }, [
    filters.status,
    filters.search,
    filters.sort,
    filters.propertyTypeId,
    filters.transactionTypeId,
    filters.location,
    filters.owner,
    filters.dateFrom,
    filters.dateTo,
    filters.page,
  ]);

  function toggleRow(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(visibleItems.map((item) => item.id)));
  }

  return (
    <div>
      <PageHeader
        title="العقارات"
        description="وحدة تشغيل الإعلانات: مراجعة، نشر، وأرشفة من مكان واحد."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} عقار
            </Badge>
            {canCreate ? (
              <Link href={routes.properties.create}>
                <Button type="button" size="small">
                  إضافة عقار
                </Button>
              </Link>
            ) : null}
          </div>
        }
      />

      <PropertiesStatusCards
        counts={meta.counts}
        activeStatus={filters.status}
      />

      <PropertiesFilters
        filters={{
          status: filters.status,
          search: filters.search,
          sort: filters.sort,
          propertyTypeId: filters.propertyTypeId,
          transactionTypeId: filters.transactionTypeId,
          location: filters.location,
          owner: filters.owner,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        }}
        propertyTypes={catalogs.propertyTypes}
        transactionTypes={catalogs.transactionTypes}
      />

      <Card>
        <CardHeader className="space-y-1">
          <h2 className="text-base font-semibold text-ink-900">قائمة العقارات</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
            {visibleItems.length !== items.length
              ? ` · عرض ${visibleItems.length.toLocaleString('ar-EG')} بعد التصفية المحلية`
              : null}
          </p>
        </CardHeader>
        <CardContent className="space-y-0 p-0 pb-4">
          <PropertiesBulkToolbar
            items={visibleItems}
            selectedIds={selectedIds}
            permissions={permissions}
            onClearSelection={() => setSelectedIds(new Set())}
          />

          <PropertiesTable
            items={visibleItems}
            permissions={permissions}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
          />

          {meta.totalPages > 1 ? (
            <div className="px-4 pt-4">
              <Pagination page={meta.page} totalPages={meta.totalPages} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
