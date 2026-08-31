import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import type { PaymentListResult } from '../types';
import { PaymentFilters } from './payment-filters';
import { PaymentsTable } from './payments-table';

interface PaymentsListProps {
  result: PaymentListResult;
  filters: {
    page: number;
    limit: number;
    search: string;
    status: string;
  };
}

export function PaymentsList({ result, filters }: PaymentsListProps) {
  const { items, meta } = result;

  return (
    <div>
      <PageHeader
        title="المدفوعات"
        description="متابعة مدفوعات الاشتراكات والعمليات عبر مزودي الدفع."
        actions={
          <Badge variant="brand">
            {meta.total.toLocaleString('ar-EG')} عملية
          </Badge>
        }
      />

      <PaymentFilters search={filters.search} status={filters.status} />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة المدفوعات</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <PaymentsTable items={items} />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
