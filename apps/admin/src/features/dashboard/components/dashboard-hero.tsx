import Link from 'next/link';
import { ArrowUpLeft, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils/cn';

export interface DashboardHeroSummary {
  propertiesTotal: number;
  pendingReview: number;
  revenueLabel: string;
  leadsTotal: number;
  usersTotal: number;
}

interface DashboardHeroProps {
  roles: string[];
  permissions: string[];
  summary: DashboardHeroSummary;
  updatedAt: string;
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
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
          <linearGradient id="hero-building" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C59D5F" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect x="0" y="108" width="280" height="32" fill="#0F172A" opacity="0.3" />
        <rect x="20" y="72" width="36" height="36" rx="3" fill="url(#hero-building)" />
        <rect x="64" y="58" width="44" height="50" rx="3" fill="#1E293B" opacity="0.85" />
        <rect x="118" y="46" width="52" height="62" rx="3" fill="url(#hero-building)" />
        <rect x="182" y="68" width="40" height="40" rx="3" fill="#334155" opacity="0.9" />
        <rect x="232" y="78" width="28" height="30" rx="3" fill="#475569" opacity="0.75" />
        <circle cx="220" cy="28" r="22" fill="#C59D5F" opacity="0.15" />
      </svg>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <p className="text-[0.6875rem] font-medium text-slate-400">{label}</p>
      <p
        className={cn(
          'mt-1 text-lg font-bold tabular-nums leading-none',
          accent ? 'text-accent-400' : 'text-white',
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function DashboardHero({ roles, permissions, summary, updatedAt }: DashboardHeroProps) {
  const canReviewProperties = hasPermission(permissions, 'properties.view');
  const canManageLeads = hasPermission(permissions, 'leads.view');

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
            <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
              ملخص تنفيذي للمنصة
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              نظرة سريعة على العقارات والإيرادات والعملاء المحتملين والمستخدمين.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryMetric
              label="العقارات"
              value={formatCount(summary.propertiesTotal)}
            />
            <SummaryMetric label="الإيرادات" value={summary.revenueLabel} accent />
            <SummaryMetric
              label="العملاء المحتملون"
              value={formatCount(summary.leadsTotal)}
            />
            <SummaryMetric label="المستخدمون" value={formatCount(summary.usersTotal)} />
          </div>

          {canReviewProperties || canManageLeads ? (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {canReviewProperties ? (
                <Link href={routes.properties.pending}>
                  <Button
                    type="button"
                    size="small"
                    className="gap-2 bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500"
                  >
                    مراجعة العقارات
                    {summary.pendingReview > 0 ? (
                      <Badge variant="warning" className="bg-white/20 text-white ring-0">
                        {formatCount(summary.pendingReview)}
                      </Badge>
                    ) : null}
                    <ArrowUpLeft className="size-4" aria-hidden />
                  </Button>
                </Link>
              ) : null}
              {canManageLeads ? (
                <Link href={routes.leads.root}>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    إدارة العملاء المحتملين
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
