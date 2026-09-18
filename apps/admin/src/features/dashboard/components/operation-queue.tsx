import Link from 'next/link';
import { ArrowUpLeft, CreditCard, Home, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import {
  hasPermission,
  type AdminPermission,
} from '@/features/auth/permissions';
import type { AdminDashboardModeration } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface OperationQueueProps {
  moderation: AdminDashboardModeration;
  permissions: string[];
}

interface QueueItem {
  key: keyof AdminDashboardModeration;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  permission: AdminPermission;
  emphasizeWhenPositive?: boolean;
}

const QUEUE_ITEMS: QueueItem[] = [
  {
    key: 'pendingProperties',
    label: 'عقارات بانتظار المراجعة',
    description: 'إعلانات تحتاج اعتماد أو رفض',
    href: routes.properties.pending,
    icon: Home,
    permission: 'properties.view',
    emphasizeWhenPositive: true,
  },
  {
    key: 'pendingPayments',
    label: 'مدفوعات معلّقة',
    description: 'عمليات دفع بانتظار المعالجة',
    href: routes.payments.pending,
    icon: CreditCard,
    permission: 'payments.view',
  },
  {
    key: 'newLeads',
    label: 'عملاء محتملون جدد',
    description: 'استفسارات جديدة بحاجة للمتابعة',
    href: routes.leads.new,
    icon: MessageSquare,
    permission: 'leads.view',
  },
];

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

export function OperationQueue({ moderation, permissions }: OperationQueueProps) {
  const visibleItems = QUEUE_ITEMS.filter((item) =>
    hasPermission(permissions, item.permission),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" aria-labelledby="operation-queue-heading">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-ink-400">العمليات</p>
        <h2 id="operation-queue-heading" className="text-lg font-bold text-ink-900 sm:text-xl">
          قائمة انتظار العمل
        </h2>
        <p className="text-sm text-ink-500">
          المهام العاجلة التي تحتاج إجراء من فريق الإدارة
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const count = moderation[item.key];
          const hasWork = count > 0;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                luxuryCardClassName,
                'group flex flex-col gap-4 p-5 transition-all hover:shadow-md',
                hasWork && item.emphasizeWhenPositive
                  ? 'border-accent-500/30 bg-accent-50/40 hover:border-accent-500/40'
                  : 'hover:border-accent-500/25',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    'flex size-11 items-center justify-center rounded-xl ring-1',
                    hasWork
                      ? 'bg-accent-500/15 text-accent-700 ring-accent-500/20'
                      : 'bg-surface-50 text-ink-500 ring-border',
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <ArrowUpLeft
                  className="size-4 shrink-0 text-ink-300 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600"
                  aria-hidden
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-3xl font-bold tabular-nums leading-none text-ink-900">
                  {formatCount(count)}
                </p>
                <p className="text-sm font-semibold text-ink-900">{item.label}</p>
                <p className="text-xs leading-relaxed text-ink-500">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
