import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardPaymentsStats } from '@/types';

interface PaymentSummaryCardProps {
  payments: AdminDashboardPaymentsStats;
}

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentSummaryCard({ payments }: PaymentSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink-900">
              ملخص المدفوعات
            </h2>
            <p className="text-sm text-ink-500">حالة المدفوعات والإيرادات</p>
          </div>
          <Badge variant="success">{formatRevenue(payments.totalRevenue)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <span className="text-sm text-ink-600">إجمالي العمليات</span>
          <span className="text-sm font-semibold text-ink-900">
            {payments.total.toLocaleString('ar-EG')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="success">ناجحة</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {payments.successful.toLocaleString('ar-EG')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="warning">معلقة</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {payments.pending.toLocaleString('ar-EG')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="danger">فاشلة</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {payments.failed.toLocaleString('ar-EG')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
