import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardLeadsStats } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface LeadsFunnelChartProps {
  leads: AdminDashboardLeadsStats;
}

const STAGES = [
  { key: 'new' as const, label: 'جديد', color: luxuryMutedColors.gold },
  { key: 'contacted' as const, label: 'تم التواصل', color: luxuryMutedColors.navy },
  { key: 'interested' as const, label: 'مهتم', color: luxuryMutedColors.green },
  { key: 'closed' as const, label: 'مغلق', color: luxuryMutedColors.gray },
] as const;

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatPercent(value: number, total: number): string | null {
  if (total <= 0) {
    return null;
  }

  return `${((value / total) * 100).toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

export function LeadsFunnelChart({ leads }: LeadsFunnelChartProps) {
  const hasData = leads.total > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          مسار التحويل
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              رحلة العميل المحتمل
            </h2>
            <p className="mt-1 text-sm text-ink-500">من أول تواصل حتى الإغلاق</p>
          </div>
          <p className="text-sm text-ink-500">
            الإجمالي{' '}
            <span className="font-bold text-ink-900">{formatCount(leads.total)}</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {!hasData ? (
          <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        ) : (
          <ol className="relative space-y-0">
            {STAGES.map((stage, index) => {
              const count = leads[stage.key];
              const percent = formatPercent(count, leads.total);
              const barWidth = leads.total > 0 ? (count / leads.total) * 100 : 0;
              const isLast = index === STAGES.length - 1;

              return (
                <li key={stage.key} className="relative flex gap-5 pb-8 last:pb-0">
                  {!isLast ? (
                    <span
                      className="absolute start-[0.6875rem] top-8 h-[calc(100%-0.5rem)] w-px bg-border"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className="relative z-[1] mt-1 size-[1.375rem] shrink-0 rounded-full ring-4 ring-white"
                    style={{ backgroundColor: stage.color }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-ink-900">{stage.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold tabular-nums text-ink-900">
                          {formatCount(count)}
                        </span>
                        {percent ? (
                          <span className="text-xs font-medium text-accent-700">
                            {percent} تحويل
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border/50">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
