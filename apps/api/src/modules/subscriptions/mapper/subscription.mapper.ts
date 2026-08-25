import { ApiProperty } from '@nestjs/swagger';
import { Plan, Subscription, SubscriptionStatus } from '@prisma/client';
import {
  PlanResponseDto,
  toPlanResponse,
} from '../../plans/mapper/plan.mapper';

export type SubscriptionWithPlan = Subscription & { plan: Plan };

export class SubscriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: PlanResponseDto })
  plan!: PlanResponseDto;

  @ApiProperty({ enum: SubscriptionStatus })
  status!: SubscriptionStatus;

  @ApiProperty({
    example: 499,
    description: 'Frozen plan price at selection time',
  })
  price!: number;

  @ApiProperty({
    example: 30,
    description: 'Frozen plan duration in days at selection time',
  })
  duration!: number;

  @ApiProperty()
  createdAt!: Date;
}

export function toSubscriptionResponse(
  subscription: SubscriptionWithPlan,
): SubscriptionResponseDto {
  return {
    id: subscription.id,
    plan: toPlanResponse(subscription.plan),
    status: subscription.status,
    price: Number(subscription.priceAtPurchase),
    duration: subscription.durationDaysAtPurchase,
    createdAt: subscription.createdAt,
  };
}
