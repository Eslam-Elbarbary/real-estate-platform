import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import type { DashboardOverview } from '@/types';
import { StatCard } from './stat-card';

interface DashboardOverviewProps {
  overview: DashboardOverview;
}

function formatActivityDate(iso: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function DashboardOverview({ overview }: DashboardOverviewProps) {
  return (
    <div>
      <PageHeader
        title="نظرة عامة"
        description="ملخص سريع لحالة المنصة — البيانات الحالية من طبقة المستودع التجريبية."
        actions={
          <Link
            href={routes.properties.pending}
            className="inline-flex h-10 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            مراجعة العقارات
            {overview.pendingApprovals > 0 ? (
              <Badge variant="warning" className="ms-2">
                {overview.pendingApprovals}
              </Badge>
            ) : null}
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overview.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">
            النشاط الأخير
          </h2>
          <p className="text-sm text-ink-500">
            أحداث حديثة من المراجعة والمدفوعات والمطورين
          </p>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-border p-0">
          {overview.recentActivity.map((item) => (
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
