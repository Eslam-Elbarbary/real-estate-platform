import { CheckCircle2, Clock3, Layers3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardSubscriptionsStats } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface SubscriptionSummaryCardProps {
  subscriptions: AdminDashboardSubscriptionsStats;
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

export function SubscriptionSummaryCard({
  subscriptions,
}: SubscriptionSummaryCardProps) {
  const rows = [
    {
      key: 'total',
      label: 'إجمالي الاشتراكات',
      value: subscriptions.total,
      icon: Layers3,
    },
    {
      key: 'active',
      label: 'النشطة',
      value: subscriptions.active,
      icon: CheckCircle2,
    },
    {
      key: 'pending',
      label: 'المعلقة',
      value: subscriptions.pending,
      icon: Clock3,
    },
  ] as const;

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          ملخص الاشتراكات
        </h2>
        <p className="text-sm text-ink-500">نظرة سريعة على حالة الاشتراكات</p>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.key}
              className="flex items-center justify-between rounded-xl border border-border/80 bg-surface-50/50 px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-border">
                  <Icon className="size-4 text-ink-600" aria-hidden />
                </div>
                <span className="text-sm font-medium text-ink-700">{row.label}</span>
              </div>
              <span className="text-xl font-bold tabular-nums text-ink-900">
                {formatCount(row.value)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
