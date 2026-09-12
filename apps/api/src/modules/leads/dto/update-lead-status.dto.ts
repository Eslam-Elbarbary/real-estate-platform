import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '@/prisma/generated/prisma-client';
import { IsIn } from 'class-validator';

/** Seller-facing status transitions (FOLLOW_UP kept in DB for legacy rows). */
export const UPDATABLE_LEAD_STATUSES = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.INTERESTED,
  LeadStatus.CLOSED,
  LeadStatus.REJECTED,
] as const;

export type UpdatableLeadStatus = (typeof UPDATABLE_LEAD_STATUSES)[number];

export class UpdateLeadStatusDto {
  @ApiProperty({
    enum: UPDATABLE_LEAD_STATUSES,
    example: LeadStatus.CONTACTED,
  })
  @IsIn(UPDATABLE_LEAD_STATUSES)
  status!: UpdatableLeadStatus;
}
