import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface ConversionKpiProps {
  conversionRate: number;
  totalLeads: number;
}

function formatPercent(value: number) {
  return `${value.toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

export function ConversionKpi({ conversionRate, totalLeads }: ConversionKpiProps) {
  const hasData = totalLeads > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          ذكاء التحويل
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          معدل التحويل
        </h2>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {hasData ? (
          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-6 py-8 text-white">
            <p className="text-5xl font-bold tracking-tight tabular-nums">
              {formatPercent(conversionRate)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              من العملاء المحتملين إلى عملاء فعليين
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent-500 transition-all duration-700"
                style={{ width: `${Math.min(conversionRate, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-[160px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات تحويل
          </div>
        )}
      </CardContent>
    </Card>
  );
}
