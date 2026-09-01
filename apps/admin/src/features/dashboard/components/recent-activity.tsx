import { Clock3, CreditCard, Home, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { DashboardActivityItem } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface RecentActivityProps {
  items: DashboardActivityItem[];
}

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  property_status: Home,
  lead: MessageSquare,
  payment: CreditCard,
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const formatter = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 1) {
    return 'الآن';
  }

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, 'day');
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          السجل
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          النشاط الأخير
        </h2>
        <p className="text-sm text-ink-500">
          آخر التحديثات على العقارات والمدفوعات والعملاء المحتملين
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {items.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا يوجد نشاط حديث
          </div>
        ) : (
          <ol className="relative space-y-0">
            {items.map((item, index) => {
              const Icon = ACTIVITY_ICONS[item.type ?? ''] ?? Clock3;
              const isLast = index === items.length - 1;
              const isGold = index % 2 === 0;

              return (
                <li key={item.id} className="relative flex gap-5 pb-10 last:pb-0">
                  {!isLast ? (
                    <span
                      className="absolute start-[1.0625rem] top-10 h-[calc(100%-1.25rem)] w-px bg-gradient-to-b from-border via-accent-500/30 to-border"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className={cn(
                      'relative z-[1] flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                      isGold ? 'bg-accent-500 text-white' : 'bg-brand-600 text-white',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-1.5">
                        <p className="font-semibold text-ink-900">{item.title}</p>
                        <p className="text-sm leading-relaxed text-ink-500">
                          {item.description}
                        </p>
                      </div>
                      <time
                        dateTime={item.createdAt}
                        className="shrink-0 text-xs font-semibold text-accent-700"
                      >
                        {formatRelativeTime(item.createdAt)}
                      </time>
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
