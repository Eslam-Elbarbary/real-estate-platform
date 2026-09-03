'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/features/auth/permissions';
import type { PropertyStatus, UserRole } from '@/types';
import type { AdminPropertiesListResult, PropertyFormCatalogs } from '../types';
import { PropertiesFilters } from './properties-filters';
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
  roles: string[];
  permissions: string[];
  filters: {
    status: PropertyStatus;
    page: number;
    limit: number;
    search: string;
  };
}

export function PropertiesList({
  result,
  catalogs,
  roles,
  permissions,
  filters,
}: PropertiesListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [createOpen, setCreateOpen] = useState(false);
  const canCreate = hasPermission(permissions, 'properties.create');

  function handleCreateSuccess(created: CreatedPropertySummary) {
    const params = new URLSearchParams();
    params.set('status', created.status);
    params.set('page', '1');

    router.replace(`/properties?${params.toString()}`);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="العقارات"
        description="مراجعة واعتماد الإعلانات وفق مسار المسودة → الاشتراك → الدفع → المراجعة → النشر."
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

      <PropertiesFilters status={filters.status} search={filters.search} />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة العقارات</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <PropertiesTable items={items} />

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
