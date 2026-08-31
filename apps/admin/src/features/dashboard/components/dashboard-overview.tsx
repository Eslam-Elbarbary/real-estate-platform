import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import type { DashboardOverview, DashboardStat } from '@/types';
import { LeadsSummaryCard } from './leads-summary-card';
import { PaymentSummaryCard } from './payment-summary-card';
import { PropertyStatusCard } from './property-status-card';
import { StatCard } from './stat-card';

interface DashboardOverviewProps {
  overview: DashboardOverview;
}

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatActivityDate(iso: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

function buildKpiStats(overview: DashboardOverview): DashboardStat[] {
  const { data } = overview;

  return [
    {
      id: 'users',
      label: 'المستخدمون',
      value: data.users.total,
      hint: `${data.users.active.toLocaleString('ar-EG')} نشط · ${data.users.inactive.toLocaleString('ar-EG')} غير نشط`,
    },
    {
      id: 'properties',
      label: 'العقارات',
      value: data.properties.total,
      hint: `${data.properties.published.toLocaleString('ar-EG')} منشور`,
    },
    {
      id: 'pending',
      label: 'بانتظار المراجعة',
      value: data.properties.pendingReview,
      hint: 'تحتاج موافقة الإدارة',
    },
    {
      id: 'revenue',
      label: 'الإيرادات',
      value: data.payments.totalRevenue,
      hint: `${data.payments.successful.toLocaleString('ar-EG')} عملية ناجحة · ${formatRevenue(data.payments.totalRevenue)}`,
    },
  ];
}

export function DashboardOverview({ overview }: DashboardOverviewProps) {
  const { data, recentActivity } = overview;
  const pendingApprovals = data.properties.pendingReview;
  const kpiStats = buildKpiStats(overview);

  return (
    <div>
      <PageHeader
        title="نظرة عامة"
        description="ملخص شامل لحالة المنصة من بيانات لوحة التحكم الحية."
        actions={
          <Link
            href={routes.properties.pending}
            className="inline-flex h-10 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            مراجعة العقارات
            {pendingApprovals > 0 ? (
              <Badge variant="warning" className="ms-2">
                {pendingApprovals}
              </Badge>
            ) : null}
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <PropertyStatusCard properties={data.properties} />
        </div>
        <div className="xl:col-span-1">
          <PaymentSummaryCard payments={data.payments} />
        </div>
        <div className="xl:col-span-1">
          <LeadsSummaryCard leads={data.leads} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">
            النشاط الأخير
          </h2>
          <p className="text-sm text-ink-500">
            ملخص سريع من حالة المراجعة والاشتراكات والعملاء المحتملين
          </p>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-border p-0">
          {recentActivity.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-ink-900">{item.title}</p>
                  <p className="text-sm text-ink-600">{item.description}</p>
                </div>
                <time
                  dateTime={item.createdAt}
                  className="shrink-0 text-xs text-ink-500"
                >
                  {formatActivityDate(item.createdAt)}
                </time>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
