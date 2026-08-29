import { Injectable } from '@nestjs/common';
import {
  LeadStatus,
  PaymentStatus,
  PropertyStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AdminDashboardStatsDto } from './mapper/admin-dashboard.mapper';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<AdminDashboardStatsDto> {
    const [
      usersTotal,
      usersActive,
      propertiesTotal,
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
      leadsInterested,
      leadsClosed,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.property.count(),
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
      this.prisma.lead.count({ where: { status: LeadStatus.INTERESTED } }),
      this.prisma.lead.count({ where: { status: LeadStatus.CLOSED } }),
    ]);

    const statusMap = new Map<PropertyStatus, number>();
    for (const row of propertyStatusCounts) {
      statusMap.set(row.status, row._count._all);
    }

    const countByStatus = (status: PropertyStatus) => statusMap.get(status) ?? 0;

    return {
      users: {
        total: usersTotal,
        active: usersActive,
        inactive: usersTotal - usersActive,
      },
      properties: {
        total: propertiesTotal,
        draft: countByStatus(PropertyStatus.DRAFT),
        pendingReview: countByStatus(PropertyStatus.PENDING_REVIEW),
        published: countByStatus(PropertyStatus.PUBLISHED),
        rejected: countByStatus(PropertyStatus.REJECTED),
        archived: countByStatus(PropertyStatus.ARCHIVED),
        expired: countByStatus(PropertyStatus.EXPIRED),
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
        totalRevenue: Number(revenueAggregate._sum.amount ?? 0),
      },
      leads: {
        total: leadsTotal,
        new: leadsNew,
        contacted: leadsContacted,
        interested: leadsInterested,
        closed: leadsClosed,
      },
    };
  }
}
