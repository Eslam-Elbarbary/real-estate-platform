import { Injectable } from '@nestjs/common';
import {
  LeadStatus,
  PaymentStatus,
  PropertyStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  AdminDashboardActivityItemDto,
  AdminDashboardInventoryItemDto,
  AdminDashboardLeadFunnelStageDto,
  AdminDashboardMonthlyRevenueDto,
  AdminDashboardRecentLeadDto,
  AdminDashboardStatsDto,
  AdminDashboardTopCompoundDto,
  AdminDashboardTopDeveloperDto,
} from './mapper/admin-dashboard.mapper';

const TOP_PERFORMERS_LIMIT = 5;
const ACTIVITY_LIMIT = 12;
const RECENT_LEADS_LIMIT = 5;
const MONTHLY_TREND_MONTHS = 12;
const RECENT_PERIOD_DAYS = 30;

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'جديد',
  [LeadStatus.CONTACTED]: 'تم التواصل',
  [LeadStatus.FOLLOW_UP]: 'متابعة',
  [LeadStatus.INTERESTED]: 'مهتم',
  [LeadStatus.CLOSED]: 'مغلق',
  [LeadStatus.REJECTED]: 'مرفوض',
};

const LEAD_FUNNEL_STAGES: Array<{
  status: LeadStatus;
  label: string;
  key: 'new' | 'contacted' | 'followUp' | 'closed';
}> = [
  { status: LeadStatus.NEW, label: 'جديد', key: 'new' },
  { status: LeadStatus.CONTACTED, label: 'تم التواصل', key: 'contacted' },
  { status: LeadStatus.FOLLOW_UP, label: 'متابعة', key: 'followUp' },
  { status: LeadStatus.CLOSED, label: 'مغلق', key: 'closed' },
];

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<AdminDashboardStatsDto> {
    const twelveMonthsAgo = this.startOfMonthMonthsAgo(MONTHLY_TREND_MONTHS - 1);
    const recentSince = this.daysAgo(RECENT_PERIOD_DAYS);
    const startOfToday = this.startOfToday();

    const [
      usersTotal,
      usersActive,
      usersRecent,
      propertiesTotal,
      propertiesRecent,
      propertyStatusCounts,
      subscriptionsTotal,
      subscriptionsPending,
      subscriptionsActive,
      paymentsTotal,
      paymentsSuccessful,
      paymentsPending,
      paymentsFailed,
      revenueAggregate,
      leadsTotal,
      leadsNew,
      leadsContacted,
      leadsFollowUp,
      leadsInterested,
      leadsClosed,
      leadsToday,
      developersTotal,
      compoundsTotal,
      propertyTypeCounts,
      successfulPaymentsForTrend,
      propertiesForGrowth,
      developerRows,
      compoundRows,
      recentStatusHistory,
      recentLeadsForActivity,
      recentPayments,
      recentLeadsForWidget,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: recentSince } } }),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { createdAt: { gte: recentSince } } }),
      this.prisma.property.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.PENDING } }),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: PaymentStatus.SUCCESS } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.SUCCESS },
        _sum: { amount: true },
      }),
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: LeadStatus.NEW } }),
      this.prisma.lead.count({ where: { status: LeadStatus.CONTACTED } }),
      this.prisma.lead.count({ where: { status: LeadStatus.FOLLOW_UP } }),
      this.prisma.lead.count({ where: { status: LeadStatus.INTERESTED } }),
      this.prisma.lead.count({ where: { status: LeadStatus.CLOSED } }),
      this.prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.developer.count(),
      this.prisma.compound.count(),
      this.prisma.property.groupBy({
        by: ['propertyTypeId'],
        where: { propertyTypeId: { not: null } },
        _count: { _all: true },
      }),
      this.prisma.payment.findMany({
        where: {
          status: PaymentStatus.SUCCESS,
          OR: [
            { paidAt: { gte: twelveMonthsAgo } },
            { paidAt: null, createdAt: { gte: twelveMonthsAgo } },
          ],
        },
        select: { amount: true, paidAt: true, createdAt: true },
      }),
      this.prisma.property.findMany({
        where: { createdAt: { gte: twelveMonthsAgo } },
        select: { createdAt: true },
      }),
      this.prisma.developer.findMany({
        include: { _count: { select: { compounds: true } } },
        orderBy: [{ nameEn: 'asc' }],
      }),
      this.prisma.compound.findMany({
        include: {
          developer: { select: { nameEn: true, nameAr: true } },
          area: { select: { nameEn: true, nameAr: true } },
          _count: { select: { properties: true } },
        },
        orderBy: [{ nameEn: 'asc' }],
      }),
      this.prisma.propertyStatusHistory.findMany({
        take: ACTIVITY_LIMIT,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { title: true, slug: true } },
        },
      }),
      this.prisma.lead.findMany({
        take: ACTIVITY_LIMIT,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { title: true, slug: true } },
        },
      }),
      this.prisma.payment.findMany({
        take: ACTIVITY_LIMIT,
        orderBy: { createdAt: 'desc' },
        where: { status: PaymentStatus.SUCCESS },
        select: { id: true, amount: true, createdAt: true, paidAt: true },
      }),
      this.prisma.lead.findMany({
        take: RECENT_LEADS_LIMIT,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { title: true, slug: true } },
          buyer: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    const statusMap = new Map<PropertyStatus, number>();
    for (const row of propertyStatusCounts) {
      statusMap.set(row.status, row._count._all);
    }

    const countByStatus = (status: PropertyStatus) => statusMap.get(status) ?? 0;

    const published = countByStatus(PropertyStatus.PUBLISHED);
    const pendingReview = countByStatus(PropertyStatus.PENDING_REVIEW);
    const rejected = countByStatus(PropertyStatus.REJECTED);
    const archived = countByStatus(PropertyStatus.ARCHIVED);
    const totalRevenue = Number(revenueAggregate._sum.amount ?? 0);

    const leadCounts = {
      new: leadsNew,
      contacted: leadsContacted,
      followUp: leadsFollowUp,
      closed: leadsClosed,
    };

    const [inventory, developers, compounds] = await Promise.all([
      this.buildInventory(propertyTypeCounts, propertiesTotal),
      this.buildTopDevelopers(developerRows),
      this.buildTopCompounds(compoundRows),
    ]);

    const monthly = this.buildMonthlyRevenue(successfulPaymentsForTrend);
    const currentMonthRevenue =
      monthly.length > 0 ? monthly[monthly.length - 1]!.revenue : 0;
    const propertyGrowthMonthly = this.buildMonthlyPropertyGrowth(propertiesForGrowth);
    const leadsIntelligence = this.buildLeadsIntelligence(leadsTotal, leadCounts, leadsClosed);
    const recentLeads = this.buildRecentLeads(recentLeadsForWidget);

    return {
      users: {
        total: usersTotal,
        active: usersActive,
        inactive: usersTotal - usersActive,
        recent: usersRecent,
      },
      properties: {
        total: propertiesTotal,
        draft: countByStatus(PropertyStatus.DRAFT),
        pendingReview,
        published,
        rejected,
        archived,
        expired: countByStatus(PropertyStatus.EXPIRED),
        recent: propertiesRecent,
      },
      subscriptions: {
        total: subscriptionsTotal,
        pending: subscriptionsPending,
        active: subscriptionsActive,
      },
      payments: {
        total: paymentsTotal,
        successful: paymentsSuccessful,
        pending: paymentsPending,
        failed: paymentsFailed,
        totalRevenue,
      },
      leads: {
        total: leadsTotal,
        new: leadsNew,
        contacted: leadsContacted,
        followUp: leadsFollowUp,
        interested: leadsInterested,
        closed: leadsClosed,
      },
      portfolio: {
        total: propertiesTotal,
        published,
        pendingReview,
        rejected,
        archived,
      },
      inventory,
      revenue: {
        totalRevenue,
        currentMonthRevenue,
        monthly,
      },
      developers,
      compounds,
      leadsIntelligence,
      moderation: {
        pendingProperties: pendingReview,
        pendingPayments: paymentsPending,
        newLeads: leadsNew,
      },
      executive: {
        totalProperties: propertiesTotal,
        totalDevelopers: developersTotal,
        totalCompounds: compoundsTotal,
        leadsToday,
      },
      propertyGrowth: {
        monthly: propertyGrowthMonthly,
      },
      recentLeads,
      activity: this.buildActivityFeed(
        recentStatusHistory,
        recentLeadsForActivity,
        recentPayments,
      ),
    };
  }

  private startOfToday(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private startOfMonthMonthsAgo(monthsAgo: number): Date {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() - monthsAgo);
    return date;
  }

  private async buildInventory(
    propertyTypeCounts: Array<{
      propertyTypeId: string | null;
      _count: { _all: number };
    }>,
    propertiesTotal: number,
  ): Promise<AdminDashboardInventoryItemDto[]> {
    const typeIds = propertyTypeCounts
      .map((row) => row.propertyTypeId)
      .filter((id): id is string => Boolean(id));

    if (typeIds.length === 0) {
      return [];
    }

    const types = await this.prisma.propertyType.findMany({
      where: { id: { in: typeIds } },
      select: { id: true, nameEn: true, nameAr: true },
    });

    const typeById = new Map(types.map((type) => [type.id, type]));

    return propertyTypeCounts
      .filter((row) => row.propertyTypeId)
      .map((row) => {
        const type = typeById.get(row.propertyTypeId!);
        const count = row._count._all;
        return {
          propertyTypeId: row.propertyTypeId!,
          nameEn: type?.nameEn ?? 'Unknown',
          nameAr: type?.nameAr ?? null,
          count,
          percentage:
            propertiesTotal > 0
              ? Math.round((count / propertiesTotal) * 1000) / 10
              : 0,
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  private buildMonthlyRevenue(
    payments: Array<{
      amount: { toString(): string };
      paidAt: Date | null;
      createdAt: Date;
    }>,
  ): AdminDashboardMonthlyRevenueDto[] {
    const buckets = new Map<string, number>();

    for (let index = MONTHLY_TREND_MONTHS - 1; index >= 0; index -= 1) {
      const monthStart = this.startOfMonthMonthsAgo(index);
      const key = this.formatMonthKey(monthStart);
      buckets.set(key, 0);
    }

    for (const payment of payments) {
      const date = payment.paidAt ?? payment.createdAt;
      const key = this.formatMonthKey(date);
      if (!buckets.has(key)) {
        continue;
      }
      buckets.set(key, (buckets.get(key) ?? 0) + Number(payment.amount));
    }

    return [...buckets.entries()].map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue * 100) / 100,
    }));
  }

  private formatMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private async buildTopDevelopers(
    developers: Array<{
      id: string;
      nameEn: string;
      nameAr: string | null;
      logoUrl: string | null;
      _count: { compounds: number };
    }>,
  ): Promise<AdminDashboardTopDeveloperDto[]> {
    if (developers.length === 0) {
      return [];
    }

    const developerIds = developers.map((developer) => developer.id);
    const publishedByDeveloper = await this.loadPublishedPropertiesByDeveloper(
      developerIds,
    );
    const totalByDeveloper = await this.loadTotalPropertiesByDeveloper(developerIds);

    return developers
      .map((developer) => ({
        id: developer.id,
        nameEn: developer.nameEn,
        nameAr: developer.nameAr,
        logoUrl: developer.logoUrl,
        compoundCount: developer._count.compounds,
        publishedPropertyCount: publishedByDeveloper.get(developer.id) ?? 0,
        totalPropertyCount: totalByDeveloper.get(developer.id) ?? 0,
      }))
      .sort((a, b) => {
        if (b.publishedPropertyCount !== a.publishedPropertyCount) {
          return b.publishedPropertyCount - a.publishedPropertyCount;
        }
        return b.compoundCount - a.compoundCount;
      })
      .slice(0, TOP_PERFORMERS_LIMIT);
  }

  private async loadPublishedPropertiesByDeveloper(
    developerIds: string[],
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();

    if (developerIds.length === 0) {
      return counts;
    }

    for (const id of developerIds) {
      counts.set(id, 0);
    }

    const grouped = await this.prisma.property.groupBy({
      by: ['compoundId'],
      where: {
        status: PropertyStatus.PUBLISHED,
        compound: { developerId: { in: developerIds } },
      },
      _count: { _all: true },
    });

    const compoundIds = grouped
      .map((row) => row.compoundId)
      .filter((id): id is string => Boolean(id));

    if (compoundIds.length === 0) {
      return counts;
    }

    const compounds = await this.prisma.compound.findMany({
      where: { id: { in: compoundIds } },
      select: { id: true, developerId: true },
    });

    const developerByCompound = new Map(
      compounds
        .filter((compound) => compound.developerId)
        .map((compound) => [compound.id, compound.developerId!]),
    );

    for (const row of grouped) {
      if (!row.compoundId) {
        continue;
      }
      const developerId = developerByCompound.get(row.compoundId);
      if (!developerId) {
        continue;
      }
      counts.set(developerId, (counts.get(developerId) ?? 0) + row._count._all);
    }

    return counts;
  }

  private async loadTotalPropertiesByDeveloper(
    developerIds: string[],
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();

    if (developerIds.length === 0) {
      return counts;
    }

    for (const id of developerIds) {
      counts.set(id, 0);
    }

    const grouped = await this.prisma.property.groupBy({
      by: ['compoundId'],
      where: {
        compound: { developerId: { in: developerIds } },
      },
      _count: { _all: true },
    });

    const compoundIds = grouped
      .map((row) => row.compoundId)
      .filter((id): id is string => Boolean(id));

    if (compoundIds.length === 0) {
      return counts;
    }

    const compounds = await this.prisma.compound.findMany({
      where: { id: { in: compoundIds } },
      select: { id: true, developerId: true },
    });

    const developerByCompound = new Map(
      compounds
        .filter((compound) => compound.developerId)
        .map((compound) => [compound.id, compound.developerId!]),
    );

    for (const row of grouped) {
      if (!row.compoundId) {
        continue;
      }
      const developerId = developerByCompound.get(row.compoundId);
      if (!developerId) {
        continue;
      }
      counts.set(developerId, (counts.get(developerId) ?? 0) + row._count._all);
    }

    return counts;
  }

  private async buildTopCompounds(
    compounds: Array<{
      id: string;
      nameEn: string;
      nameAr: string | null;
      developer: { nameEn: string; nameAr: string | null } | null;
      area: { nameEn: string; nameAr: string | null };
      _count: { properties: number };
    }>,
  ): Promise<AdminDashboardTopCompoundDto[]> {
    if (compounds.length === 0) {
      return [];
    }

    const publishedCounts = await this.loadPublishedPropertyCountsByCompound(
      compounds.map((compound) => compound.id),
    );

    return compounds
      .map((compound) => ({
        id: compound.id,
        nameEn: compound.nameEn,
        nameAr: compound.nameAr,
        developerName: compound.developer
          ? compound.developer.nameAr ?? compound.developer.nameEn
          : null,
        locationName: compound.area.nameAr ?? compound.area.nameEn,
        publishedPropertyCount: publishedCounts.get(compound.id) ?? 0,
        totalListings: compound._count.properties,
      }))
      .sort((a, b) => {
        if (b.publishedPropertyCount !== a.publishedPropertyCount) {
          return b.publishedPropertyCount - a.publishedPropertyCount;
        }
        return b.totalListings - a.totalListings;
      })
      .slice(0, TOP_PERFORMERS_LIMIT);
  }

  private async loadPublishedPropertyCountsByCompound(
    compoundIds: string[],
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();

    if (compoundIds.length === 0) {
      return counts;
    }

    const grouped = await this.prisma.property.groupBy({
      by: ['compoundId'],
      where: {
        compoundId: { in: compoundIds },
        status: PropertyStatus.PUBLISHED,
      },
      _count: { _all: true },
    });

    for (const row of grouped) {
      if (row.compoundId) {
        counts.set(row.compoundId, row._count._all);
      }
    }

    return counts;
  }

  private buildMonthlyPropertyGrowth(
    properties: Array<{ createdAt: Date }>,
  ) {
    const buckets = new Map<string, number>();

    for (let index = MONTHLY_TREND_MONTHS - 1; index >= 0; index -= 1) {
      const monthStart = this.startOfMonthMonthsAgo(index);
      const key = this.formatMonthKey(monthStart);
      buckets.set(key, 0);
    }

    for (const property of properties) {
      const key = this.formatMonthKey(property.createdAt);
      if (!buckets.has(key)) {
        continue;
      }
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    return [...buckets.entries()].map(([month, count]) => ({ month, count }));
  }

  private buildRecentLeads(
    leads: Array<{
      id: string;
      status: LeadStatus;
      createdAt: Date;
      property: { title: string | null; slug: string };
      buyer: { firstName: string | null; lastName: string | null; email: string };
    }>,
  ): AdminDashboardRecentLeadDto[] {
    return leads.map((lead) => ({
      id: lead.id,
      customerName: this.formatCustomerName(lead.buyer),
      propertyTitle: lead.property.title ?? lead.property.slug,
      status: lead.status,
      statusLabel: LEAD_STATUS_LABELS[lead.status],
      createdAt: lead.createdAt.toISOString(),
    }));
  }

  private formatCustomerName(buyer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  }): string {
    const name = [buyer.firstName, buyer.lastName].filter(Boolean).join(' ').trim();
    return name || buyer.email;
  }

  private buildLeadsIntelligence(
    total: number,
    counts: Record<'new' | 'contacted' | 'followUp' | 'closed', number>,
    closedCount: number,
  ) {
    const funnel: AdminDashboardLeadFunnelStageDto[] = LEAD_FUNNEL_STAGES.map(
      (stage) => {
        const count = counts[stage.key];
        return {
          status: stage.status,
          label: stage.label,
          count,
          conversionPercentage:
            total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
        };
      },
    );

    return {
      total,
      conversionRate: total > 0 ? Math.round((closedCount / total) * 1000) / 10 : 0,
      funnel,
    };
  }

  private buildActivityFeed(
    statusHistory: Array<{
      id: string;
      toStatus: PropertyStatus;
      createdAt: Date;
      property: { title: string | null; slug: string };
    }>,
    leads: Array<{
      id: string;
      status: LeadStatus;
      createdAt: Date;
      property: { title: string | null; slug: string };
    }>,
    payments: Array<{
      id: string;
      amount: { toString(): string };
      createdAt: Date;
    }>,
  ): AdminDashboardActivityItemDto[] {
    const items: AdminDashboardActivityItemDto[] = [
      ...statusHistory.map((entry) => ({
        id: `status-${entry.id}`,
        type: 'property_status',
        title: 'تحديث حالة عقار',
        description: `${entry.property.title ?? entry.property.slug} → ${entry.toStatus}`,
        createdAt: entry.createdAt.toISOString(),
      })),
      ...leads.map((lead) => ({
        id: `lead-${lead.id}`,
        type: 'lead',
        title: 'عميل محتمل جديد',
        description: `${lead.property.title ?? lead.property.slug} · ${lead.status}`,
        createdAt: lead.createdAt.toISOString(),
      })),
      ...payments.map((payment) => ({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: 'دفعة ناجحة',
        description: `${Number(payment.amount).toLocaleString('ar-EG')} جنيه`,
        createdAt: payment.createdAt.toISOString(),
      })),
    ];

    return items
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, ACTIVITY_LIMIT);
  }
}
