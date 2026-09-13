import { Injectable, Logger } from '@nestjs/common';
import {
  PropertyStatus,
  Subscription,
  SubscriptionStatus,
} from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

const EXPIRY_BATCH_SIZE = 100;

type ExpirableSubscription = Subscription & {
  property: {
    id: string;
    status: PropertyStatus;
    ownerId: string;
    slug: string;
  };
};

export type ExpireSubscriptionsResult = {
  expiredCount: number;
  propertiesExpiredCount: number;
};

@Injectable()
export class SubscriptionExpiryService {
  private readonly logger = new Logger(SubscriptionExpiryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Expires ACTIVE subscriptions whose endsAt has passed.
   * PUBLISHED properties linked to those subscriptions become EXPIRED.
   * Safe to call repeatedly — already-expired records are skipped.
   */
  async expireSubscriptions(): Promise<ExpireSubscriptionsResult> {
    const now = new Date();
    let expiredCount = 0;
    let propertiesExpiredCount = 0;

    while (true) {
      const batch = await this.prisma.subscription.findMany({
        where: {
          status: SubscriptionStatus.ACTIVE,
          endsAt: { lte: now },
        },
        take: EXPIRY_BATCH_SIZE,
        orderBy: { id: 'asc' },
        include: {
          property: {
            select: {
              id: true,
              status: true,
              ownerId: true,
              slug: true,
            },
          },
        },
      });

      if (batch.length === 0) {
        break;
      }

      for (const subscription of batch as ExpirableSubscription[]) {
        const result = await this.expireOne(subscription, now);
        if (result.expired) {
          expiredCount += 1;
          if (result.propertyExpired) {
            propertiesExpiredCount += 1;
          }
        }
      }

      if (batch.length < EXPIRY_BATCH_SIZE) {
        break;
      }
    }

    return { expiredCount, propertiesExpiredCount };
  }

  private async expireOne(
    subscription: ExpirableSubscription,
    now: Date,
  ): Promise<{ expired: boolean; propertyExpired: boolean }> {
    let propertyExpired = false;
    let notifyPayload: {
      ownerId: string;
      propertyId: string;
      propertySlug: string;
      subscriptionId: string;
    } | null = null;

    try {
      const didExpire = await this.prisma.$transaction(async (tx) => {
        const current = await tx.subscription.findUnique({
          where: { id: subscription.id },
          include: {
            property: {
              select: {
                id: true,
                status: true,
                ownerId: true,
                slug: true,
              },
            },
          },
        });

        if (
          !current ||
          current.status !== SubscriptionStatus.ACTIVE ||
          !current.endsAt ||
          current.endsAt.getTime() > now.getTime()
        ) {
          return false;
        }

        await tx.subscription.update({
          where: { id: current.id },
          data: { status: SubscriptionStatus.EXPIRED },
        });

        if (current.property.status === PropertyStatus.PUBLISHED) {
          await tx.property.update({
            where: { id: current.property.id },
            data: { status: PropertyStatus.EXPIRED },
          });

          await tx.propertyStatusHistory.create({
            data: {
              propertyId: current.property.id,
              fromStatus: PropertyStatus.PUBLISHED,
              toStatus: PropertyStatus.EXPIRED,
              changedById: null,
              reason: 'Listing subscription expired',
            },
          });

          propertyExpired = true;
        }

        notifyPayload = {
          ownerId: current.property.ownerId,
          propertyId: current.property.id,
          propertySlug: current.property.slug,
          subscriptionId: current.id,
        };

        return true;
      });

      if (didExpire && notifyPayload) {
        await this.notificationsService.notifySubscriptionExpired(notifyPayload);
      }

      return { expired: didExpire, propertyExpired };
    } catch (error) {
      this.logger.warn(
        `Failed to expire subscription ${subscription.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return { expired: false, propertyExpired: false };
    }
  }
}
