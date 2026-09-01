import type { LucideIcon } from 'lucide-react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

export type DashboardKpiTrend = 'up' | 'down' | 'neutral';

export interface DashboardKpiCardProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
  className?: string;
  trend?: DashboardKpiTrend;
  trendLabel?: string;
}

const TREND_STYLES: Record<
  DashboardKpiTrend,
  { icon: LucideIcon; className: string }
> = {
  up: { icon: TrendingUp, className: 'text-emerald-700 bg-emerald-50 ring-emerald-100' },
  down: { icon: TrendingDown, className: 'text-red-700 bg-red-50 ring-red-100' },
  neutral: { icon: Minus, className: 'text-ink-500 bg-surface-50 ring-border/60' },
};

export function DashboardKpiCard({
  label,
  value,
  description,
  icon: Icon,
  variant = 'secondary',
  className,
  trend,
  trendLabel,
}: DashboardKpiCardProps) {
  const isPrimary = variant === 'primary';
  const trendConfig = trend ? TREND_STYLES[trend] : null;
  const TrendIcon = trendConfig?.icon;

  return (
    <article
      className={cn(
        luxuryCardClassName,
        'group flex flex-col justify-between transition-all duration-300 hover:shadow-md',
        isPrimary ? 'min-h-[240px] p-6 lg:min-h-full' : 'min-h-[160px] p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            'flex items-center justify-center rounded-2xl bg-surface-50 ring-1 ring-border transition-all duration-300 group-hover:bg-accent-500/10 group-hover:ring-accent-500/25',
            isPrimary ? 'size-16' : 'size-12',
          )}
        >
          <Icon
            className={cn(
              'text-ink-700 transition-colors group-hover:text-accent-600',
              isPrimary ? 'size-7' : 'size-5',
            )}
            aria-hidden
          />
        </div>
        <p className="pt-1 text-xs font-semibold tracking-[0.12em] text-ink-400 uppercase">
          {label}
        </p>
      </div>

      <div className={cn('space-y-3', isPrimary ? 'mt-10' : 'mt-6')}>
        <p
          className={cn(
            'font-bold leading-none tracking-tight text-ink-900',
            isPrimary ? 'text-[2.75rem] sm:text-[3.25rem]' : 'text-[1.75rem]',
          )}
        >
          {value}
        </p>
        <p className="text-sm leading-relaxed text-ink-500">{description}</p>
        {trend && trendLabel && TrendIcon ? (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
              trendConfig.className,
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden />
            <span>{trendLabel}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
