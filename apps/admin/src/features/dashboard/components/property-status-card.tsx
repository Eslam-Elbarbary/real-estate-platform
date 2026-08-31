import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardPropertiesStats } from '@/types';

interface PropertyStatusCardProps {
  properties: AdminDashboardPropertiesStats;
}

const STATUS_ROWS: Array<{
  key: keyof AdminDashboardPropertiesStats;
  label: string;
  variant: 'default' | 'brand' | 'success' | 'warning' | 'danger';
}> = [
  { key: 'draft', label: 'مسودة', variant: 'default' },
  { key: 'pendingReview', label: 'بانتظار المراجعة', variant: 'warning' },
  { key: 'published', label: 'منشور', variant: 'success' },
  { key: 'rejected', label: 'مرفوض', variant: 'danger' },
  { key: 'archived', label: 'مؤرشف', variant: 'default' },
  { key: 'expired', label: 'منتهي', variant: 'danger' },
];

export function PropertyStatusCard({ properties }: PropertyStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink-900">
              حالة العقارات
            </h2>
            <p className="text-sm text-ink-500">توزيع العقارات حسب الحالة</p>
          </div>
          <Badge variant="brand">
            الإجمالي {properties.total.toLocaleString('ar-EG')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {STATUS_ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between rounded-md border border-border bg-surface-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Badge variant={row.variant}>{row.label}</Badge>
            </div>
            <span className="text-sm font-semibold text-ink-900">
              {properties[row.key].toLocaleString('ar-EG')}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
