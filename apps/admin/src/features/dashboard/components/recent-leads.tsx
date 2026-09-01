import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { AdminDashboardRecentLead } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface RecentLeadsProps {
  leads: AdminDashboardRecentLead[];
}

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

export function RecentLeads({ leads }: RecentLeadsProps) {
  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          فرص العملاء
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          أحدث العملاء المحتملين
        </h2>
        <p className="text-sm text-ink-500">آخر الاستفسارات والفرص على المنصة</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {leads.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد طلبات جديدة
          </div>
        ) : (
          <ol className="space-y-3">
            {leads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={routes.leads.details(lead.id)}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-white px-4 py-3.5 transition-all hover:border-accent-500/25 hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate font-semibold text-ink-900">
                      {lead.customerName}
                    </p>
                    <p className="truncate text-sm text-ink-500">{lead.propertyTitle}</p>
                    <span className="inline-flex rounded-full bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
                      {lead.statusLabel}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <time
                      dateTime={lead.createdAt}
                      className="text-xs font-medium text-ink-400"
                    >
                      {formatRelativeTime(lead.createdAt)}
                    </time>
                    <ArrowUpLeft
                      className="size-4 text-ink-300 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
