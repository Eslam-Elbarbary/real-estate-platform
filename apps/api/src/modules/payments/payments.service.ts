import {
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

    if (subscription.status !== SubscriptionStatus.PENDING) {
      throw new ConflictException('Subscription is not pending payment');
    }

    const existingSuccess = await this.prisma.payment.findFirst({
      where: {
        subscriptionId: subscription.id,
        status: PaymentStatus.SUCCESS,
      },
      select: { id: true },
    });

    if (existingSuccess) {
      throw new ConflictException('Subscription has already been paid');
    }

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
    const successMetadata = charge.metadata;

    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          provider: charge.provider,
          providerRef: charge.providerRef,
          amount: subscription.priceAtPurchase,
          status: PaymentStatus.SUCCESS,
          paidAt,
          metadata: successMetadata,
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

      const property = await tx.property.update({
        where: { id: subscription.propertyId },
        data: {
          status: PropertyStatus.PENDING_REVIEW,
          submittedAt: subscription.property.submittedAt ?? paidAt,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: property.id,
          fromStatus: subscription.property.status,
          toStatus: PropertyStatus.PENDING_REVIEW,
          changedById: ownerId,
          reason: 'Subscription payment completed',
        },
      });

      return created;
    });

    return toPaymentResponse(payment);
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
