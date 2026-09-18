import Link from 'next/link';
import {
  ArrowUpLeft,
  Building2,
  Clock3,
  Home,
  MapPin,
  MessageSquare,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { hasPermission } from '@/features/auth/permissions';
import type { AdminDashboardExecutiveSummary, AdminDashboardModeration } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ExecutiveHeroProps {
  roles: string[];
  permissions: string[];
  updatedAt: string;
  moderation: AdminDashboardModeration;
  executive: AdminDashboardExecutiveSummary;
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="size-3.5 shrink-0 text-accent-500/80" aria-hidden />
        <p className="text-[0.6875rem] font-medium">{label}</p>
      </div>
      <p className="mt-1.5 text-lg font-bold tabular-nums leading-none text-white">
        {formatCount(value)}
      </p>
    </div>
  );
}

function HeroVisual() {
  return (
    <div
      className="relative hidden h-full min-h-[160px] overflow-hidden rounded-xl border border-white/10 bg-white/5 lg:flex lg:items-end lg:justify-center lg:p-5"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(197_157_95_/_0.22),transparent_55%)]" />
      <svg
        viewBox="0 0 280 140"
        className="relative z-[1] h-full w-full max-h-[140px] opacity-90"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="exec-building" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C59D5F" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect x="0" y="108" width="280" height="32" fill="#0F172A" opacity="0.3" />
        <rect x="20" y="72" width="36" height="36" rx="3" fill="url(#exec-building)" />
        <rect x="64" y="58" width="44" height="50" rx="3" fill="#1E293B" opacity="0.85" />
        <rect x="118" y="46" width="52" height="62" rx="3" fill="url(#exec-building)" />
        <rect x="182" y="68" width="40" height="40" rx="3" fill="#334155" opacity="0.9" />
        <rect x="232" y="78" width="28" height="30" rx="3" fill="#475569" opacity="0.75" />
        <circle cx="220" cy="28" r="22" fill="#C59D5F" opacity="0.15" />
      </svg>
    </div>
  );
}

export function ExecutiveHero({
  roles,
  permissions,
  updatedAt,
  moderation,
  executive,
}: ExecutiveHeroProps) {
  void roles;
  const canCreateProperty = hasPermission(permissions, 'properties.create');
  const canReviewProperties = hasPermission(permissions, 'properties.view');

  const metrics = [
    { icon: Home, label: 'إجمالي العقارات', value: executive.totalProperties },
    { icon: Building2, label: 'المطورين', value: executive.totalDevelopers },
    { icon: MapPin, label: 'الكومباوندات', value: executive.totalCompounds },
    { icon: MessageSquare, label: 'العملاء اليوم', value: executive.leadsToday },
  ] as const;

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border border-[#1e293b]/20',
        'bg-gradient-to-br from-[#0F172A] to-[#1E293B]',
        'shadow-sm',
      )}
    >
      <div
        className="pointer-events-none absolute -start-16 -top-16 size-56 rounded-full bg-accent-500/12 blur-3xl"
        aria-hidden
      />

      <div className="relative grid gap-6 p-6 lg:grid-cols-[1fr_minmax(0,14rem)] lg:items-stretch lg:p-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-wide text-accent-500">
              {siteConfig.productName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock3 className="size-3.5 shrink-0 text-accent-500/80" aria-hidden />
              <span>آخر تحديث: {formatUpdatedAt(updatedAt)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
              لوحة التحكم العقارية
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              إدارة المحفظة العقارية والمطورين والعملاء من مكان واحد
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <HeroMetric key={metric.label} {...metric} />
            ))}
          </div>

          {canCreateProperty || canReviewProperties ? (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {canCreateProperty ? (
                <Link href={routes.properties.root}>
                  <Button
                    type="button"
                    size="small"
                    className="gap-2 bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500"
                  >
                    <Plus className="size-4" aria-hidden />
                    إضافة عقار
                  </Button>
                </Link>
              ) : null}
              {canReviewProperties ? (
                <Link href={routes.properties.pending}>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    مراجعة الطلبات
                    {moderation.pendingProperties > 0 ? (
                      <Badge variant="warning" className="bg-white/20 text-white ring-0">
                        {formatCount(moderation.pendingProperties)}
                      </Badge>
                    ) : null}
                    <ArrowUpLeft className="size-4" aria-hidden />
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
