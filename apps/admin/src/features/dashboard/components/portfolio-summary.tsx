import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardPropertiesStats } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface PortfolioSummaryProps {
  properties: AdminDashboardPropertiesStats;
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

const METRICS = [
  {
    key: 'total' as const,
    label: 'إجمالي العقارات',
    color: luxuryMutedColors.navy,
    emphasis: true,
  },
  {
    key: 'published' as const,
    label: 'منشور',
    color: luxuryMutedColors.green,
    emphasis: false,
  },
  {
    key: 'pendingReview' as const,
    label: 'بانتظار المراجعة',
    color: luxuryMutedColors.gold,
    emphasis: false,
  },
  {
    key: 'rejected' as const,
    label: 'مرفوض',
    color: luxuryMutedColors.red,
    emphasis: false,
  },
  {
    key: 'archived' as const,
    label: 'مؤرشف',
    color: luxuryMutedColors.gray,
    emphasis: false,
  },
] as const;

export function PortfolioSummary({ properties }: PortfolioSummaryProps) {
  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          المحفظة العقارية
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          نظرة على المحفظة العقارية
        </h2>
        <p className="text-sm text-ink-500">صحة وتوزيع العقارات على المنصة</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {METRICS.map((metric) => {
            const value =
              metric.key === 'total'
                ? properties.total
                : properties[metric.key];

            return (
              <div
                key={metric.key}
                className={cn(
                  'rounded-xl border border-border/80 bg-surface-50/50 px-4 py-4',
                  metric.emphasis && 'sm:col-span-2 lg:col-span-1 lg:bg-white',
                )}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: metric.color }}
                    aria-hidden
                  />
                  <p className="text-sm font-medium text-ink-600">{metric.label}</p>
                </div>
                <p
                  className={cn(
                    'font-bold tabular-nums text-ink-900',
                    metric.emphasis ? 'text-4xl tracking-tight' : 'text-2xl',
                  )}
                >
                  {formatCount(value)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
