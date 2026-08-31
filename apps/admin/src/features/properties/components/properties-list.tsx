import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import type { PropertyStatus } from '@/types';
import type { AdminPropertiesListResult } from '../types';
import { PropertiesFilters } from './properties-filters';
import { PropertiesTable } from './properties-table';

interface PropertiesListProps {
  result: AdminPropertiesListResult;
  filters: {
    status: PropertyStatus;
    page: number;
    limit: number;
    search: string;
  };
}

export function PropertiesList({ result, filters }: PropertiesListProps) {
  const { items, meta } = result;

  return (
    <div>
      <PageHeader
        title="العقارات"
        description="مراجعة واعتماد الإعلانات وفق مسار المسودة → الاشتراك → الدفع → المراجعة → النشر."
        actions={
          <Badge variant="brand">
            {meta.total.toLocaleString('ar-EG')} عقار
          </Badge>
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
    </div>
  );
}
