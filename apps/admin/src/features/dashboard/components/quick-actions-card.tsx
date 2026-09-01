import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpLeft, CreditCard, Home, MessageSquare, Package } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import {
  hasPermission,
  type AdminPermission,
} from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface QuickActionsCardProps {
  roles: UserRole[];
}

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  permission: AdminPermission;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'مراجعة العقارات',
    description: 'اعتماد أو رفض الإعلانات المعلقة',
    href: routes.properties.pending,
    icon: Home,
    permission: 'properties.view',
  },
  {
    label: 'العملاء المحتملون',
    description: 'متابعة الاستفسارات وتحديث الحالة',
    href: routes.leads.root,
    icon: MessageSquare,
    permission: 'leads.view',
  },
  {
    label: 'خطط الاشتراك',
    description: 'ضبط الخطط وحدود الإعلانات',
    href: routes.plans.root,
    icon: Package,
    permission: 'plans.view',
  },
  {
    label: 'المدفوعات',
    description: 'مراجعة العمليات والإيرادات',
    href: routes.payments.root,
    icon: CreditCard,
    permission: 'payments.view',
  },
];

export function QuickActionsCard({ roles }: QuickActionsCardProps) {
  const visibleActions = QUICK_ACTIONS.filter((action) =>
    hasPermission(roles, action.permission),
  );

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          الوصول السريع
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          اختصارات الإدارة
        </h2>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-all hover:border-accent-500/30 hover:bg-surface-50/80 hover:shadow-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-700 ring-1 ring-accent-500/15">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {action.label}
                  </p>
                  <p className="truncate text-xs text-ink-500">{action.description}</p>
                </div>
                <ArrowUpLeft
                  className="size-4 shrink-0 text-ink-300 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
