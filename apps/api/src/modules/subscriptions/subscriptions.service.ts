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
  type Plan,
  type Property,
} from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { PropertyValidationService } from '../properties/services/property-validation.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: PropertyValidationService,
  ) {}

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

    await this.assertPropertyComplete(property);

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
        'Property already has an open subscription',
      );
    }

    const priceAtPurchase = plan.price;
    const durationDaysAtPurchase = plan.durationDays;
    const isBasicPlan = Number(priceAtPurchase) === 0;

    if (isBasicPlan) {
      return this.activateBasicPlan(
        ownerId,
        property,
        plan.id,
        priceAtPurchase,
        durationDaysAtPurchase,
      );
    }

    return this.createPaidPlanPending(
      ownerId,
      property,
      plan.id,
      priceAtPurchase,
      durationDaysAtPurchase,
    );
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

  private async activateBasicPlan(
    ownerId: string,
    property: Property,
    planId: string,
    priceAtPurchase: Plan['price'],
    durationDaysAtPurchase: number,
  ): Promise<SubscriptionResponseDto> {
    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setUTCDate(endsAt.getUTCDate() + durationDaysAtPurchase);

    const created = await this.prisma.$transaction(async (tx) => {
      const open = await tx.subscription.findFirst({
        where: {
          propertyId: property.id,
          status: { in: OPEN_SUBSCRIPTION_STATUSES },
        },
        select: { id: true },
      });

      if (open) {
        throw new ConflictException(
          'Property already has an open subscription',
        );
      }

      const subscription = await tx.subscription.create({
        data: {
          propertyId: property.id,
          planId,
          status: SubscriptionStatus.ACTIVE,
          priceAtPurchase,
          durationDaysAtPurchase,
          startsAt: now,
          endsAt,
        },
        include: { plan: true },
      });

      await tx.property.update({
        where: { id: property.id },
        data: {
          status: PropertyStatus.PENDING_REVIEW,
          submittedAt: now,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: property.id,
          fromStatus: property.status,
          toStatus: PropertyStatus.PENDING_REVIEW,
          changedById: ownerId,
          reason: 'Basic plan activated — submitted for review',
        },
      });

      return subscription;
    });

    return toSubscriptionResponse(created, { nextAction: 'await_review' });
  }

  private async createPaidPlanPending(
    ownerId: string,
    property: Property,
    planId: string,
    priceAtPurchase: Plan['price'],
    durationDaysAtPurchase: number,
  ): Promise<SubscriptionResponseDto> {
    const created = await this.prisma.$transaction(async (tx) => {
      const open = await tx.subscription.findFirst({
        where: {
          propertyId: property.id,
          status: { in: OPEN_SUBSCRIPTION_STATUSES },
        },
        select: { id: true },
      });

      if (open) {
        throw new ConflictException(
          'Property already has an open subscription',
        );
      }

      const subscription = await tx.subscription.create({
        data: {
          propertyId: property.id,
          planId,
          status: SubscriptionStatus.PENDING,
          priceAtPurchase,
          durationDaysAtPurchase,
        },
        include: { plan: true },
      });

      await tx.property.update({
        where: { id: property.id },
        data: { status: PropertyStatus.PENDING_PAYMENT },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: property.id,
          fromStatus: property.status,
          toStatus: PropertyStatus.PENDING_PAYMENT,
          changedById: ownerId,
          reason: 'Paid plan selected — awaiting payment',
        },
      });

      return subscription;
    });

    return toSubscriptionResponse(created, { nextAction: 'pay' });
  }

  private async assertPropertyComplete(property: Property): Promise<void> {
    const imageCount = await this.prisma.propertyImage.count({
      where: { propertyId: property.id },
    });
    const completion = this.validationService.evaluate(property, imageCount);

    if (!completion.completed) {
      throw new BadRequestException({
        message: 'Property is incomplete',
        missingFields: completion.missingFields,
      });
    }
  }

  private async findOwnedPropertyOrThrow(ownerId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }
}
