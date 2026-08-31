import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
  Plan,
  Property,
  Subscription,
  User,
} from '@prisma/client';

export class AdminPaymentPlanDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class AdminPaymentPropertyDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;
}

export class AdminPaymentOwnerDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiProperty()
  email!: string;
}

export class AdminPaymentSubscriptionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: AdminPaymentPlanDto })
  plan!: AdminPaymentPlanDto;

  @ApiProperty({ type: AdminPaymentPropertyDto })
  property!: AdminPaymentPropertyDto;

  @ApiProperty({ type: AdminPaymentOwnerDto })
  owner!: AdminPaymentOwnerDto;
}

export class AdminPaymentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 499 })
  amount!: number;

  @ApiProperty({ example: 'EGP' })
  currency!: string;

  @ApiProperty({ enum: PaymentProvider })
  provider!: PaymentProvider;

  @ApiPropertyOptional({ nullable: true })
  providerRef!: string | null;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiPropertyOptional({ nullable: true })
  paidAt!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ type: AdminPaymentSubscriptionDto })
  subscription!: AdminPaymentSubscriptionDto;
}

type AdminPaymentOwnerSource = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;

type AdminPaymentPropertySource = Pick<Property, 'id' | 'title' | 'currency'> & {
  owner: AdminPaymentOwnerSource;
};

export type AdminPaymentSource = Payment & {
  subscription: Subscription & {
    plan: Pick<Plan, 'id' | 'name'>;
    property: AdminPaymentPropertySource;
  };
};

export const ADMIN_PAYMENT_INCLUDE = {
  subscription: {
    include: {
      plan: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          currency: true,
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  },
} as const;

function dateToIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function toOwnerDto(owner: AdminPaymentOwnerSource): AdminPaymentOwnerDto {
  const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || null;
  return {
    id: owner.id,
    name,
    email: owner.email,
  };
}

export function toAdminPayment(payment: AdminPaymentSource): AdminPaymentDto {
  const { subscription } = payment;

  return {
    id: payment.id,
    amount: Number(payment.amount),
    currency: subscription.property.currency,
    provider: payment.provider,
    providerRef: payment.providerRef,
    status: payment.status,
    paidAt: dateToIso(payment.paidAt),
    createdAt: payment.createdAt.toISOString(),
    subscription: {
      id: subscription.id,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
      },
      property: {
        id: subscription.property.id,
        title: subscription.property.title,
      },
      owner: toOwnerDto(subscription.property.owner),
    },
  };
}
