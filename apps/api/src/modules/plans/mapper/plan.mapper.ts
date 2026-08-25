import { ApiProperty } from '@nestjs/swagger';
import { Plan, PlanStatus, Prisma } from '@prisma/client';

export class PlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Premium' })
  name!: string;

  @ApiProperty({ example: 'PREMIUM' })
  code!: string;

  @ApiProperty({ example: 499 })
  price!: number;

  @ApiProperty({ example: 30 })
  durationDays!: number;

  @ApiProperty({
    description: 'Plan feature payload (JSON)',
    example: { listingLimit: 5, featuredBoost: false },
  })
  features!: Prisma.JsonValue;

  @ApiProperty({ enum: PlanStatus, example: PlanStatus.ACTIVE })
  status!: PlanStatus;
}

function decimalToNumber(value: Plan['price']): number {
  return Number(value);
}

export function toPlanResponse(plan: Plan): PlanResponseDto {
  return {
    id: plan.id,
    name: plan.name,
    code: plan.code,
    price: decimalToNumber(plan.price),
    durationDays: plan.durationDays,
    features: plan.features,
    status: plan.status,
  };
}
