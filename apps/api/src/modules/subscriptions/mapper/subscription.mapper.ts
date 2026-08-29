import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Plan, Subscription, SubscriptionStatus } from '@prisma/client';
import {
  PlanResponseDto,
  toPlanResponse,
} from '../../plans/mapper/plan.mapper';

export type SubscriptionWithPlan = Subscription & { plan: Plan };

export type SubscriptionNextAction = 'pay' | 'await_review';

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

  @ApiPropertyOptional({
    nullable: true,
    description: 'Subscription start time when active',
  })
  startsAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Subscription end time when active',
  })
  endsAt!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional({
    enum: ['pay', 'await_review'],
    description: 'Suggested client next step after plan selection',
  })
  nextAction?: SubscriptionNextAction;
}

function dateToIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

export function toSubscriptionResponse(
  subscription: SubscriptionWithPlan,
  options?: { nextAction?: SubscriptionNextAction },
): SubscriptionResponseDto {
  return {
    id: subscription.id,
    plan: toPlanResponse(subscription.plan),
    status: subscription.status,
    price: Number(subscription.priceAtPurchase),
    duration: subscription.durationDaysAtPurchase,
    startsAt: dateToIso(subscription.startsAt),
    endsAt: dateToIso(subscription.endsAt),
    createdAt: subscription.createdAt,
    ...(options?.nextAction ? { nextAction: options.nextAction } : {}),
  };
}
