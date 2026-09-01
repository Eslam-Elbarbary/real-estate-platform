import Link from 'next/link';
import { ArrowUpLeft, CreditCard, Home, MessageSquare, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { AdminDashboardModeration } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface ModerationCenterProps {
  moderation: AdminDashboardModeration;
}

interface ModerationItem {
  key: keyof AdminDashboardModeration;
  label: string;
  suffix: string;
  href: string;
  icon: LucideIcon;
}

const ITEMS: ModerationItem[] = [
  {
    key: 'pendingProperties',
    label: 'عقار يحتاج مراجعة',
    suffix: 'عقار',
    href: routes.properties.pending,
    icon: Home,
  },
  {
    key: 'pendingPayments',
    label: 'طلب دفع',
    suffix: 'طلب',
    href: routes.payments.root,
    icon: CreditCard,
  },
  {
    key: 'newLeads',
    label: 'عميل محتمل جديد',
    suffix: 'عميل',
    href: routes.leads.root,
    icon: MessageSquare,
  },
];

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

export function ModerationCenter({ moderation }: ModerationCenterProps) {
  const totalActions =
    moderation.pendingProperties + moderation.pendingPayments + moderation.newLeads;

  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          مركز المتابعة
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              يتطلب إجراء
            </h2>
            <p className="mt-1 text-sm text-ink-500">مهام المراجعة والمتابعة العاجلة</p>
          </div>
          {totalActions > 0 ? (
            <div className="flex items-center gap-2 rounded-full bg-accent-500/10 px-3 py-1.5 text-sm font-semibold text-accent-800 ring-1 ring-accent-500/20">
              <ShieldAlert className="size-4" aria-hidden />
              {formatCount(totalActions)} مهمة
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {ITEMS.map((item) => {
            const count = moderation[item.key];
            const Icon = item.icon;
            const needsAction = count > 0;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'group flex flex-col gap-3 rounded-xl border px-5 py-4 transition-all',
                  needsAction
                    ? 'border-accent-500/25 bg-accent-500/5 hover:border-accent-500/40 hover:shadow-sm'
                    : 'border-border/70 bg-white hover:border-border hover:shadow-sm',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-xl ring-1',
                      needsAction
                        ? 'bg-accent-500/15 text-accent-800 ring-accent-500/20'
                        : 'bg-surface-50 text-ink-500 ring-border/60',
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <ArrowUpLeft
                    className="size-4 text-ink-300 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600"
                    aria-hidden
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      'text-3xl font-bold tabular-nums',
                      needsAction ? 'text-accent-800' : 'text-ink-900',
                    )}
                  >
                    {formatCount(count)}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">{item.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
