'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/features/auth/permissions';
import type { PropertyStatus } from '@/types';
import type {
  AdminPropertiesListResult,
  AdminPropertySort,
  PropertyFormCatalogs,
} from '../types';
import { PropertiesFilters } from './properties-filters';
import { PropertiesStatusCards } from './properties-status-cards';
import { PropertiesTable } from './properties-table';
import { PropertyCreateDialog } from './property-create-dialog';

interface CreatedPropertySummary {
  id: string;
  status: string;
  title: string;
}

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
  };
}

export function PropertiesList({
  result,
  catalogs,
  permissions,
  filters,
}: PropertiesListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [createOpen, setCreateOpen] = useState(false);
  const canCreate = hasPermission(permissions, 'properties.create');

  function handleCreateSuccess(_created: CreatedPropertySummary) {
    router.replace('/properties?sort=newest');
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="العقارات"
        description="إدارة إعلانات العقارات، المراجعة، والنشر من لوحة التحكم."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} عقار
            </Badge>
            {canCreate ? (
              <Button type="button" size="small" onClick={() => setCreateOpen(true)}>
                إضافة عقار
              </Button>
            ) : null}
          </div>
        }
      />

      <PropertiesStatusCards
        counts={meta.counts}
        activeStatus={filters.status}
      />

      <PropertiesFilters
        status={filters.status}
        search={filters.search}
        sort={filters.sort}
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة العقارات</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <PropertiesTable items={items} permissions={permissions} />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      <PropertyCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        catalogs={catalogs}
        permissions={permissions}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
