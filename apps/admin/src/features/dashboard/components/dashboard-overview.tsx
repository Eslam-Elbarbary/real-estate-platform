import {
  Banknote,
  ClipboardCheck,
  Home,
  MessageSquare,
  Users,
} from 'lucide-react';
import type {
  AdminDashboardRevenueAnalytics,
  DashboardOverview,
} from '@/types';
import { CompoundPerformance } from './compound-performance';
import { ConversionKpi } from './conversion-kpi';
import {
  DashboardKpiCard,
  type DashboardKpiTrend,
} from './dashboard-kpi-card';
import { DashboardIntro } from './dashboard-intro';
import { DeveloperPerformance } from './developer-performance';
import { InventoryChart } from './inventory-chart';
import { LeadPipeline } from './lead-pipeline';
import { OperationQueue } from './operation-queue';
import { PortfolioIntelligence } from './portfolio-intelligence';
import { PropertyGrowthChart } from './property-growth-chart';
import { QuickActionsCard } from './quick-actions-card';
import { RecentActivity } from './recent-activity';
import { RecentLeads } from './recent-leads';
import { RevenueChart } from './revenue-chart';

interface DashboardOverviewProps {
  overview: DashboardOverview;
  roles?: string[];
  permissions: string[];
  updatedAt?: string;
}

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function getRevenueTrend(revenue: AdminDashboardRevenueAnalytics): {
  trend: DashboardKpiTrend;
  trendLabel: string;
} | null {
  const { monthly } = revenue;
  if (monthly.length < 2) {
    return null;
  }

  const current = monthly[monthly.length - 1]!.revenue;
  const previous = monthly[monthly.length - 2]!.revenue;

  if (previous <= 0 && current <= 0) {
    return null;
  }

  if (current > previous) {
    return { trend: 'up', trendLabel: 'أعلى من الشهر السابق' };
  }

  if (current < previous) {
    return { trend: 'down', trendLabel: 'أقل من الشهر السابق' };
  }

  return { trend: 'neutral', trendLabel: 'مستقر عن الشهر السابق' };
}

export function DashboardOverview({
  overview,
  permissions,
  updatedAt,
}: DashboardOverviewProps) {
  const { data, recentActivity } = overview;
  const revenueTrend = getRevenueTrend(data.revenue);

  return (
    <div className="space-y-8">
      <DashboardIntro updatedAt={updatedAt ?? new Date().toISOString()} />

      <OperationQueue moderation={data.moderation} permissions={permissions} />

      <section className="space-y-3" aria-labelledby="kpi-heading">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-ink-400">المؤشرات</p>
          <h2 id="kpi-heading" className="text-lg font-bold text-ink-900 sm:text-xl">
            نظرة سريعة على المنصة
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <DashboardKpiCard
            label="إجمالي العقارات"
            value={formatCount(data.properties.total)}
            description={`${formatCount(data.properties.recent)} جديد خلال 30 يوم`}
            icon={Home}
            className="min-h-[148px] xl:min-h-[160px]"
          />
          <DashboardKpiCard
            label="منشورة"
            value={formatCount(data.properties.published)}
            description="عقارات ظاهرة في السوق"
            icon={Home}
            className="min-h-[148px] xl:min-h-[160px]"
          />
          <DashboardKpiCard
            label="بانتظار المراجعة"
            value={formatCount(data.properties.pendingReview)}
            description="تحتاج إجراء إداري"
            icon={ClipboardCheck}
            trend={data.properties.pendingReview > 0 ? 'up' : 'neutral'}
            trendLabel={
              data.properties.pendingReview > 0 ? 'في قائمة الانتظار' : 'لا معلقات'
            }
            className="min-h-[148px] xl:min-h-[160px]"
          />
          <DashboardKpiCard
            label="المستخدمون"
            value={formatCount(data.users.total)}
            description={`${formatCount(data.users.active)} نشط`}
            icon={Users}
            className="min-h-[148px] xl:min-h-[160px]"
          />
          <DashboardKpiCard
            label="العملاء المحتملون"
            value={formatCount(data.leads.total)}
            description={`${formatCount(data.leads.new)} جديد`}
            icon={MessageSquare}
            className="min-h-[148px] xl:min-h-[160px]"
          />
          <DashboardKpiCard
            label="الإيرادات"
            value={formatRevenue(data.revenue.totalRevenue)}
            description={`${formatRevenue(data.revenue.currentMonthRevenue)} هذا الشهر`}
            icon={Banknote}
            trend={revenueTrend?.trend}
            trendLabel={revenueTrend?.trendLabel}
            className="min-h-[148px] xl:min-h-[160px]"
          />
        </div>
      </section>

      <QuickActionsCard permissions={permissions} />

      <section className="space-y-6" aria-labelledby="analytics-heading">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-ink-400">التحليلات</p>
          <h2 id="analytics-heading" className="text-lg font-bold text-ink-900 sm:text-xl">
            أداء السوق والمحفظة
          </h2>
        </div>

        <PortfolioIntelligence portfolio={data.portfolio} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InventoryChart inventory={data.inventory} />
          </div>
          <ConversionKpi
            conversionRate={data.leadsIntelligence.conversionRate}
            totalLeads={data.leads.total}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart revenue={data.revenue} />
          <PropertyGrowthChart propertyGrowth={data.propertyGrowth} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DeveloperPerformance developers={data.developers} />
          <CompoundPerformance compounds={data.compounds} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <LeadPipeline leadsIntelligence={data.leadsIntelligence} />
          <RecentLeads leads={data.recentLeads} />
        </div>

        <RecentActivity items={recentActivity} />
      </section>
    </div>
  );
}
