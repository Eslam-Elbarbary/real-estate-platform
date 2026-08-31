import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import type { LeadListResult } from '../types';
import { LeadFilters } from './lead-filters';
import { LeadsTable } from './leads-table';

interface LeadsListProps {
  result: LeadListResult;
  filters: {
    page: number;
    limit: number;
    search: string;
    status: string;
  };
}

export function LeadsList({ result, filters }: LeadsListProps) {
  const { items, meta } = result;

  return (
    <div>
      <PageHeader
        title="الطلبات"
        description="متابعة طلبات التواصل والاستفسارات على العقارات."
        actions={
          <Badge variant="brand">
            {meta.total.toLocaleString('ar-EG')} طلب
          </Badge>
        }
      />

      <LeadFilters search={filters.search} status={filters.status} />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة الطلبات</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <LeadsTable items={items} />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
