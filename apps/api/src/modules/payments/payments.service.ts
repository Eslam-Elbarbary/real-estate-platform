import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PaymentStatus,
  Prisma,
  PropertyStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PropertyValidationService } from '../properties/services/property-validation.service';
import {
  PaymentResponseDto,
  toPaymentResponse,
} from './mapper/payment.mapper';
import {
  PAYMENT_PROVIDER,
  type PaymentProvider,
} from './providers/payment-provider.interface';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: PropertyValidationService,
    private readonly notificationsService: NotificationsService,
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: PaymentProvider,
  ) {}

  async paySubscription(
    ownerId: string,
    subscriptionId: string,
  ): Promise<PaymentResponseDto> {
    const subscription = await this.findOwnedSubscriptionOrThrow(
      ownerId,
      subscriptionId,
    );

    if (Number(subscription.priceAtPurchase) === 0) {
      throw new BadRequestException(
        'Basic plans do not require payment. The listing is submitted through plan selection.',
      );
    }

    const existingSuccess = await this.prisma.payment.findFirst({
      where: {
        subscriptionId: subscription.id,
        status: PaymentStatus.SUCCESS,
      },
    });

    if (existingSuccess) {
      return toPaymentResponse(existingSuccess);
    }

    if (subscription.property.status !== PropertyStatus.PENDING_PAYMENT) {
      throw new ConflictException(
        'Property is not awaiting payment for this subscription',
      );
    }

    await this.assertPropertyComplete(subscription.propertyId);

    if (subscription.status !== SubscriptionStatus.PENDING) {
      throw new ConflictException('Subscription is not pending payment');
    }

    /**
     * Real payment providers (Paymob/Stripe) cannot participate in a DB transaction.
     * Phase 8B keeps the mock charge outside the transaction; a future webhook-driven
     * `completeSuccessfulPayment(providerRef)` handler must make completion idempotent.
     */
    const charge = await this.paymentProvider.charge({
      subscriptionId: subscription.id,
      amount: subscription.priceAtPurchase,
      currency: 'EGP',
      metadata: {
        propertyId: subscription.propertyId,
        planId: subscription.planId,
      },
    });

    if (!charge.success) {
      const failedMetadata: Prisma.InputJsonValue = {
        ...(charge.metadata ?? {}),
        failureReason: charge.failureReason ?? 'Payment failed',
      };
      const failed = await this.prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          provider: charge.provider,
          providerRef: charge.providerRef,
          amount: subscription.priceAtPurchase,
          status: PaymentStatus.FAILED,
          metadata: failedMetadata,
        },
      });
      throw new ConflictException(
        charge.failureReason ?? `Payment failed (${failed.id})`,
      );
    }

    const paidAt = new Date();
    const endsAt = new Date(paidAt);
    endsAt.setUTCDate(endsAt.getUTCDate() + subscription.durationDaysAtPurchase);

    const result = await this.prisma.$transaction(async (tx) => {
      const duplicateSuccess = await tx.payment.findFirst({
        where: {
          subscriptionId: subscription.id,
          status: PaymentStatus.SUCCESS,
        },
      });

      if (duplicateSuccess) {
        return { payment: duplicateSuccess, isNew: false };
      }

      const currentSubscription = await tx.subscription.findUniqueOrThrow({
        where: { id: subscription.id },
      });

      if (currentSubscription.status !== SubscriptionStatus.PENDING) {
        throw new ConflictException('Subscription is not pending payment');
      }

      const currentProperty = await tx.property.findUniqueOrThrow({
        where: { id: subscription.propertyId },
      });

      if (currentProperty.status !== PropertyStatus.PENDING_PAYMENT) {
        throw new ConflictException(
          'Property is not awaiting payment for this subscription',
        );
      }

      const created = await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          provider: charge.provider,
          providerRef: charge.providerRef,
          amount: subscription.priceAtPurchase,
          status: PaymentStatus.SUCCESS,
          paidAt,
          metadata: charge.metadata,
        },
      });

      await tx.subscription.update({
        where: { id: subscription.id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          startsAt: paidAt,
          endsAt,
        },
      });

      await tx.property.update({
        where: { id: subscription.propertyId },
        data: {
          status: PropertyStatus.PENDING_REVIEW,
          submittedAt: paidAt,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: subscription.propertyId,
          fromStatus: PropertyStatus.PENDING_PAYMENT,
          toStatus: PropertyStatus.PENDING_REVIEW,
          changedById: ownerId,
          reason: 'Subscription payment completed',
        },
      });

      return { payment: created, isNew: true };
    });

    if (result.isNew) {
      const property = await this.prisma.property.findUniqueOrThrow({
        where: { id: subscription.propertyId },
        select: { id: true, slug: true, ownerId: true },
      });

      await this.notificationsService.notifyPaymentSuccess({
        ownerId: property.ownerId,
        propertyId: property.id,
        propertySlug: property.slug,
        paymentId: result.payment.id,
      });
    }

    return toPaymentResponse(result.payment);
  }

  async listForSubscription(
    ownerId: string,
    subscriptionId: string,
  ): Promise<PaymentResponseDto[]> {
    await this.findOwnedSubscriptionOrThrow(ownerId, subscriptionId);

    const payments = await this.prisma.payment.findMany({
      where: { subscriptionId },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(toPaymentResponse);
  }

  private async assertPropertyComplete(propertyId: string): Promise<void> {
    const property = await this.prisma.property.findUniqueOrThrow({
      where: { id: propertyId },
    });
    const imageCount = await this.prisma.propertyImage.count({
      where: { propertyId },
    });
    const completion = this.validationService.evaluate(property, imageCount);

    if (!completion.completed) {
      throw new BadRequestException({
        message: 'Property is incomplete',
        missingFields: completion.missingFields,
      });
    }
  }

  private async findOwnedSubscriptionOrThrow(
    ownerId: string,
    subscriptionId: string,
  ) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        property: { ownerId },
      },
      include: {
        property: {
          select: {
            id: true,
            status: true,
            ownerId: true,
            submittedAt: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }
}
