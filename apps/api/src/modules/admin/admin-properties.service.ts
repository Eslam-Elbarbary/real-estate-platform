import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus, SubscriptionStatus } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { SavedSearchMatchingService } from '../alerts/saved-search-matching.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ListAdminPropertiesQueryDto, AdminPropertySort } from './dto/list-admin-properties-query.dto';
import {
  AdminPropertyReviewCardDto,
  AdminPropertyReviewDetailsDto,
  toAdminPropertyActionResponse,
  toAdminPropertyReviewCard,
  toAdminPropertyReviewDetails,
} from './mapper/admin-property.mapper';

const PROPERTY_CARD_INCLUDE = {
  propertyType: true,
  transactionType: true,
  area: { include: { city: { include: { country: true } } } },
  district: true,
  compound: {
    include: {
      developer: true,
    },
  },
  owner: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
    },
  },
  images: {
    select: {
      type: true,
      isPrimary: true,
      sortOrder: true,
      mediaAsset: {
        select: { url: true },
      },
    },
    orderBy: [{ sortOrder: 'asc' as const }, { createdAt: 'asc' as const }],
  },
  _count: {
    select: { favorites: true },
  },
} satisfies Prisma.PropertyInclude;

const PROPERTY_DETAILS_INCLUDE = {
  ...PROPERTY_CARD_INCLUDE,
  features: { include: { feature: true } },
  images: {
    include: { mediaAsset: true },
    orderBy: { sortOrder: 'asc' as const },
  },
  subscriptions: {
    include: { plan: true },
    orderBy: { createdAt: 'desc' as const },
  },
  statusHistory: {
    include: {
      changedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  reviewedBy: {
    select: { id: true, firstName: true, lastName: true },
  },
} satisfies Prisma.PropertyInclude;

export type AdminPropertyStatusCounts = {
  ALL: number;
  DRAFT: number;
  PENDING_REVIEW: number;
  PENDING_PAYMENT: number;
  PUBLISHED: number;
  REJECTED: number;
  ARCHIVED: number;
  EXPIRED: number;
};

function emptyStatusCounts(): AdminPropertyStatusCounts {
  return {
    ALL: 0,
    DRAFT: 0,
    PENDING_REVIEW: 0,
    PENDING_PAYMENT: 0,
    PUBLISHED: 0,
    REJECTED: 0,
    ARCHIVED: 0,
    EXPIRED: 0,
  };
}

function buildListWhere(
  query: ListAdminPropertiesQueryDto,
  options?: { includeStatus?: boolean },
): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};
  const includeStatus = options?.includeStatus !== false;

  if (includeStatus && query.status) {
    where.status = query.status;
  }

  if (query.search?.trim()) {
    const term = query.search.trim();
    where.OR = [
      { title: { contains: term, mode: 'insensitive' } },
      { slug: { contains: term, mode: 'insensitive' } },
      { referenceNumber: { contains: term, mode: 'insensitive' } },
      { owner: { email: { contains: term, mode: 'insensitive' } } },
      { owner: { firstName: { contains: term, mode: 'insensitive' } } },
      { owner: { lastName: { contains: term, mode: 'insensitive' } } },
    ];
  }

  return where;
}

function resolveListOrderBy(
  sort: AdminPropertySort | undefined,
): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    case AdminPropertySort.OLDEST:
      return [{ createdAt: 'asc' }, { id: 'asc' }];
    case AdminPropertySort.PRICE_ASC:
      return [{ price: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }];
    case AdminPropertySort.PRICE_DESC:
      return [{ price: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }];
    case AdminPropertySort.NEWEST:
    default:
      return [
        { publishedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
        { id: 'desc' },
      ];
  }
}

@Injectable()
export class AdminPropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly savedSearchMatchingService: SavedSearchMatchingService,
  ) {}

  async listProperties(query: ListAdminPropertiesQueryDto): Promise<{
    data: AdminPropertyReviewCardDto[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      counts: AdminPropertyStatusCounts;
    };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = buildListWhere(query, { includeStatus: true });
    const countsWhere = buildListWhere(query, { includeStatus: false });
    const orderBy = resolveListOrderBy(query.sort ?? AdminPropertySort.NEWEST);

    const [total, rows, grouped] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: PROPERTY_CARD_INCLUDE,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.property.groupBy({
        by: ['status'],
        where: countsWhere,
        _count: { _all: true },
      }),
    ]);

    const counts = emptyStatusCounts();
    for (const row of grouped) {
      counts[row.status] = row._count._all;
      counts.ALL += row._count._all;
    }

    return {
      data: rows.map((row) => toAdminPropertyReviewCard(row)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
        counts,
      },
    };
  }

  async getPropertyDetails(propertyId: string): Promise<AdminPropertyReviewDetailsDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: PROPERTY_DETAILS_INCLUDE,
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const subscriptionIds = property.subscriptions.map((subscription) => subscription.id);
    const payments =
      subscriptionIds.length === 0
        ? []
        : await this.prisma.payment.findMany({
            where: { subscriptionId: { in: subscriptionIds } },
            orderBy: { createdAt: 'desc' },
          });

    return toAdminPropertyReviewDetails({
      ...property,
      payments,
    });
  }

  async approveProperty(adminId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PENDING_REVIEW) {
      throw new BadRequestException('Only pending review properties can be approved');
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        propertyId,
        status: SubscriptionStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    if (
      !subscription ||
      !subscription.endsAt ||
      subscription.endsAt.getTime() <= now.getTime()
    ) {
      throw new BadRequestException(
        'Property does not have a valid active subscription',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.PUBLISHED,
          publishedAt: now,
          reviewedAt: now,
          reviewedById: adminId,
          rejectedReason: null,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId,
          fromStatus: property.status,
          toStatus: PropertyStatus.PUBLISHED,
          changedById: adminId,
          reason: 'Approved by moderator',
        },
      });

      return next;
    });

    await this.onPropertyApproved(updated);

    return toAdminPropertyActionResponse(updated);
  }

  async rejectProperty(adminId: string, propertyId: string, reason: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PENDING_REVIEW) {
      throw new BadRequestException('Only pending review properties can be rejected');
    }

    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.REJECTED,
          reviewedAt: now,
          reviewedById: adminId,
          rejectedReason: reason,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId,
          fromStatus: property.status,
          toStatus: PropertyStatus.REJECTED,
          changedById: adminId,
          reason,
        },
      });

      return next;
    });

    await this.onPropertyRejected(updated, reason);

    return toAdminPropertyActionResponse(updated);
  }

  async archiveProperty(adminId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status === PropertyStatus.ARCHIVED) {
      throw new BadRequestException('Property is already archived');
    }

    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.ARCHIVED,
          archivedAt: now,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId,
          fromStatus: property.status,
          toStatus: PropertyStatus.ARCHIVED,
          changedById: adminId,
          reason: 'Archived by administrator',
        },
      });

      return next;
    });

    return toAdminPropertyActionResponse(updated);
  }

  /**
   * Admin publish: DRAFT | REJECTED | ARCHIVED | EXPIRED → PUBLISHED.
   * Does not require an active subscription (unlike user approve flow).
   */
  async publishProperty(adminId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const allowed: PropertyStatus[] = [
      PropertyStatus.DRAFT,
      PropertyStatus.REJECTED,
      PropertyStatus.ARCHIVED,
      PropertyStatus.EXPIRED,
    ];

    if (!allowed.includes(property.status)) {
      throw new BadRequestException(
        `Cannot publish a property in status ${property.status}`,
      );
    }

    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.PUBLISHED,
          publishedAt: now,
          archivedAt: null,
          rejectedReason: null,
          reviewedAt: now,
          reviewedById: adminId,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId,
          fromStatus: property.status,
          toStatus: PropertyStatus.PUBLISHED,
          changedById: adminId,
          reason: 'Published by administrator',
        },
      });

      return next;
    });

    await this.onPropertyApproved(updated);

    return toAdminPropertyActionResponse(updated);
  }

  /** PUBLISHED → DRAFT (unpublish). */
  async unpublishProperty(adminId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PUBLISHED) {
      throw new BadRequestException('Only published properties can be unpublished');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.DRAFT,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId,
          fromStatus: property.status,
          toStatus: PropertyStatus.DRAFT,
          changedById: adminId,
          reason: 'Unpublished by administrator',
        },
      });

      return next;
    });

    return toAdminPropertyActionResponse(updated);
  }

  /** ARCHIVED → DRAFT (restore). */
  async restoreProperty(adminId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.ARCHIVED) {
      throw new BadRequestException('Only archived properties can be restored');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.DRAFT,
          archivedAt: null,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId,
          fromStatus: property.status,
          toStatus: PropertyStatus.DRAFT,
          changedById: adminId,
          reason: 'Restored from archive by administrator',
        },
      });

      return next;
    });

    return toAdminPropertyActionResponse(updated);
  }

  private async onPropertyApproved(property: {
    id: string;
    ownerId: string;
    slug: string;
  }): Promise<void> {
    await this.notificationsService.notifyPropertyApproved({
      ownerId: property.ownerId,
      propertyId: property.id,
      propertySlug: property.slug,
    });
    await this.savedSearchMatchingService.notifyMatchingAlerts(property.id);
  }

  private async onPropertyRejected(
    property: { id: string; ownerId: string; slug: string; reviewedAt: Date | null },
    reason: string,
  ): Promise<void> {
    await this.notificationsService.notifyPropertyRejected({
      ownerId: property.ownerId,
      propertyId: property.id,
      propertySlug: property.slug,
      reason,
      reviewedAt: (property.reviewedAt ?? new Date()).toISOString(),
    });
  }
}
