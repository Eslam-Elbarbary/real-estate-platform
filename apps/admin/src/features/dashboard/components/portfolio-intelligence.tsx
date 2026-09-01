import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardPortfolio } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface PortfolioIntelligenceProps {
  portfolio: AdminDashboardPortfolio;
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatPercent(value: number, total: number) {
  if (total <= 0) {
    return '0%';
  }

  return `${((value / total) * 100).toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

const STATUS_ITEMS = [
  { key: 'published' as const, label: 'منشور', color: luxuryMutedColors.green },
  { key: 'pendingReview' as const, label: 'بانتظار المراجعة', color: luxuryMutedColors.gold },
  { key: 'rejected' as const, label: 'مرفوض', color: luxuryMutedColors.red },
  { key: 'archived' as const, label: 'مؤرشف', color: luxuryMutedColors.gray },
] as const;

export function PortfolioIntelligence({ portfolio }: PortfolioIntelligenceProps) {
  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          ذكاء المحفظة
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          صحة المحفظة العقارية
        </h2>
        <p className="text-sm text-ink-500">توزيع العقارات حسب حالة النشر والمراجعة</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="flex flex-col justify-center rounded-2xl border border-border/80 bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-6 py-8 text-white">
            <p className="text-sm font-medium text-slate-400">إجمالي العقارات</p>
            <p className="mt-3 text-5xl font-bold tracking-tight tabular-nums">
              {formatCount(portfolio.total)}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {formatCount(portfolio.published)} منشور حالياً
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {STATUS_ITEMS.map((item) => {
              const count = portfolio[item.key];
              const percentage = formatPercent(count, portfolio.total);
              const barWidth = portfolio.total > 0 ? (count / portfolio.total) * 100 : 0;

              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-border/70 bg-white px-5 py-4 transition-shadow hover:shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      className="size-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: item.color }}
                      aria-hidden
                    />
                    <p className="text-sm font-medium text-ink-600">{item.label}</p>
                  </div>
                  <p className="text-3xl font-bold tabular-nums text-ink-900">
                    {formatCount(count)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-accent-700">
                    {percentage} من إجمالي المحفظة
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/50">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
