import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardLeadsIntelligence } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface LeadPipelineProps {
  leadsIntelligence: AdminDashboardLeadsIntelligence;
}

const STAGE_COLORS = [
  luxuryMutedColors.gold,
  luxuryMutedColors.navy,
  luxuryMutedColors.amber,
  luxuryMutedColors.green,
];

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatPercent(value: number) {
  return `${value.toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

export function LeadPipeline({ leadsIntelligence }: LeadPipelineProps) {
  const { total, funnel } = leadsIntelligence;
  const hasData = total > 0 && funnel.length > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          ذكاء العملاء
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              مسار العملاء المحتملين
            </h2>
            <p className="mt-1 text-sm text-ink-500">من الاستفسار الجديد حتى الإغلاق</p>
          </div>
          <p className="text-sm text-ink-500">
            الإجمالي{' '}
            <span className="font-bold text-ink-900">{formatCount(total)}</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {!hasData ? (
          <div className="flex h-[160px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {funnel.map((stage, index) => {
              const color = STAGE_COLORS[index % STAGE_COLORS.length];
              const barWidth =
                total > 0 ? Math.max((stage.count / total) * 100, stage.count > 0 ? 8 : 0) : 0;

              return (
                <div
                  key={stage.status}
                  className="relative flex flex-col rounded-xl border border-border/70 bg-white p-4"
                >
                  {index < funnel.length - 1 ? (
                    <span
                      className="absolute -start-3 top-1/2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-300 lg:flex"
                      aria-hidden
                    >
                      ←
                    </span>
                  ) : null}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <p className="text-sm font-semibold text-ink-900">{stage.label}</p>
                  </div>
                  <p className="text-3xl font-bold tabular-nums text-ink-900">
                    {formatCount(stage.count)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-accent-700">
                    {formatPercent(stage.conversionPercentage)} من الإجمالي
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border/50">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
