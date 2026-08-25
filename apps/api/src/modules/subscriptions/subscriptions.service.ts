import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PlanStatus,
  PropertyStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  SubscriptionResponseDto,
  toSubscriptionResponse,
} from './mapper/subscription.mapper';

/** Property statuses where the owner may still select a listing plan. */
const PLAN_SELECTABLE_STATUSES: PropertyStatus[] = [
  PropertyStatus.DRAFT,
  PropertyStatus.PENDING_PAYMENT,
  PropertyStatus.REJECTED,
];

/** Subscriptions that block creating another for the same property. */
const OPEN_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.PENDING,
  SubscriptionStatus.ACTIVE,
];

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForProperty(
    ownerId: string,
    propertyId: string,
    planId: string,
  ): Promise<SubscriptionResponseDto> {
    const property = await this.findOwnedPropertyOrThrow(ownerId, propertyId);

    if (!PLAN_SELECTABLE_STATUSES.includes(property.status)) {
      throw new ForbiddenException(
        'Property is not eligible for plan selection',
      );
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || plan.status !== PlanStatus.ACTIVE) {
      throw new BadRequestException('Plan is not available');
    }

    const existingOpen = await this.prisma.subscription.findFirst({
      where: {
        propertyId: property.id,
        status: { in: OPEN_SUBSCRIPTION_STATUSES },
      },
      select: { id: true },
    });

    if (existingOpen) {
      throw new ConflictException(
        'Property already has an active subscription',
      );
    }

    const created = await this.prisma.subscription.create({
      data: {
        propertyId: property.id,
        planId: plan.id,
        status: SubscriptionStatus.PENDING,
        priceAtPurchase: plan.price,
        durationDaysAtPurchase: plan.durationDays,
      },
      include: { plan: true },
    });

    return toSubscriptionResponse(created);
  }

  async getForProperty(
    ownerId: string,
    propertyId: string,
  ): Promise<SubscriptionResponseDto> {
    await this.findOwnedPropertyOrThrow(ownerId, propertyId);

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        propertyId,
        status: { in: OPEN_SUBSCRIPTION_STATUSES },
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return toSubscriptionResponse(subscription);
  }

  private async findOwnedPropertyOrThrow(ownerId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, ownerId },
      select: { id: true, status: true, ownerId: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }
}
