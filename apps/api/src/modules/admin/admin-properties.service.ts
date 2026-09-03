import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SavedSearchMatchingService } from '../alerts/saved-search-matching.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ListAdminPropertiesQueryDto } from './dto/list-admin-properties-query.dto';
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
} satisfies Prisma.PropertyInclude;

const PROPERTY_DETAILS_INCLUDE = {
  ...PROPERTY_CARD_INCLUDE,
  compound: true,
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

@Injectable()
export class AdminPropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly savedSearchMatchingService: SavedSearchMatchingService,
  ) {}

  async listProperties(query: ListAdminPropertiesQueryDto): Promise<{
    data: AdminPropertyReviewCardDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const status = query.status ?? PropertyStatus.PENDING_REVIEW;

    const where: Prisma.PropertyWhereInput = { status };

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: PROPERTY_CARD_INCLUDE,
        orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) => toAdminPropertyReviewCard(row)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
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
