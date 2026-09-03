import { Banknote, Home, MessageSquare, Users } from 'lucide-react';
import type {
  AdminDashboardRevenueAnalytics,
  DashboardOverview,
  UserRole,
} from '@/types';
import { CompoundPerformance } from './compound-performance';
import { ConversionKpi } from './conversion-kpi';
import {
  DashboardKpiCard,
  type DashboardKpiTrend,
} from './dashboard-kpi-card';
import { DeveloperPerformance } from './developer-performance';
import { ExecutiveHero } from './executive-hero';
import { InventoryChart } from './inventory-chart';
import { LeadPipeline } from './lead-pipeline';
import { ModerationCenter } from './moderation-center';
import { PortfolioIntelligence } from './portfolio-intelligence';
import { PropertyGrowthChart } from './property-growth-chart';
import { RecentActivity } from './recent-activity';
import { RecentLeads } from './recent-leads';
import { RevenueChart } from './revenue-chart';

interface DashboardOverviewProps {
  overview: DashboardOverview;
  roles: string[];
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

function formatPercent(value: number) {
  return `${value.toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
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

export function DashboardOverview({ overview, roles, permissions, updatedAt }: DashboardOverviewProps) {
  const { data, recentActivity } = overview;
  const revenueTrend = getRevenueTrend(data.revenue);

  return (
    <div className="space-y-6">
      <ExecutiveHero
        roles={roles}
        permissions={permissions}
        updatedAt={updatedAt ?? new Date().toISOString()}
        moderation={data.moderation}
        executive={data.executive}
      />

      <PortfolioIntelligence portfolio={data.portfolio} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <DashboardKpiCard
          label="المستخدمون"
          value={formatCount(data.users.total)}
          description={`${formatCount(data.users.recent)} مستخدم جديد خلال 30 يوم`}
          icon={Users}
          trend={data.users.recent > 0 ? 'up' : 'neutral'}
          trendLabel={
            data.users.recent > 0
              ? `${formatCount(data.users.recent)} تسجيل حديث`
              : 'لا تسجيلات حديثة'
          }
        />
        <DashboardKpiCard
          label="العقارات"
          value={formatCount(data.properties.total)}
          description={`${formatCount(data.properties.recent)} إعلان جديد خلال 30 يوم`}
          icon={Home}
          trend={data.properties.recent > 0 ? 'up' : 'neutral'}
          trendLabel={
            data.properties.recent > 0
              ? `${formatCount(data.properties.recent)} إعلان جديد`
              : 'لا إعلانات حديثة'
          }
        />
        <DashboardKpiCard
          label="الإيرادات"
          value={formatRevenue(data.revenue.totalRevenue)}
          description={`${formatRevenue(data.revenue.currentMonthRevenue)} إيرادات هذا الشهر`}
          icon={Banknote}
          trend={revenueTrend?.trend}
          trendLabel={revenueTrend?.trendLabel}
        />
        <DashboardKpiCard
          label="العملاء المحتملون"
          value={formatCount(data.leads.total)}
          description={`${formatPercent(data.leadsIntelligence.conversionRate)} معدل التحويل`}
          icon={MessageSquare}
          trend={
            data.leadsIntelligence.conversionRate > 0
              ? 'up'
              : data.leads.total > 0
                ? 'neutral'
                : undefined
          }
          trendLabel={
            data.leads.total > 0
              ? `${formatCount(data.leads.closed)} عميل مغلق`
              : undefined
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryChart inventory={data.inventory} />
        </div>
        <ConversionKpi
          conversionRate={data.leadsIntelligence.conversionRate}
          totalLeads={data.leads.total}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart revenue={data.revenue} />
        <PropertyGrowthChart propertyGrowth={data.propertyGrowth} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DeveloperPerformance developers={data.developers} />
        <CompoundPerformance compounds={data.compounds} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <LeadPipeline leadsIntelligence={data.leadsIntelligence} />
        <RecentLeads leads={data.recentLeads} />
      </section>

      <ModerationCenter moderation={data.moderation} />

      <RecentActivity items={recentActivity} />
    </div>
  );
}
