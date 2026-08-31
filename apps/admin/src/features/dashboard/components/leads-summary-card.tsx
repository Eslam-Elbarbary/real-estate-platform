import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardLeadsStats } from '@/types';

interface LeadsSummaryCardProps {
  leads: AdminDashboardLeadsStats;
}

export function LeadsSummaryCard({ leads }: LeadsSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink-900">
              ملخص العملاء المحتملين
            </h2>
            <p className="text-sm text-ink-500">توزيع الاستفسارات حسب الحالة</p>
          </div>
          <Badge variant="brand">
            الإجمالي {leads.total.toLocaleString('ar-EG')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="warning">جديد</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {leads.new.toLocaleString('ar-EG')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="brand">تم التواصل</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {leads.contacted.toLocaleString('ar-EG')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="success">مهتم</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {leads.interested.toLocaleString('ar-EG')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Badge variant="default">مغلق</Badge>
          <span className="text-sm font-semibold text-ink-900">
            {leads.closed.toLocaleString('ar-EG')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
