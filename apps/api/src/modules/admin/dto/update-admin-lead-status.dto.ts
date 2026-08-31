import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateAdminLeadStatusDto {
  @ApiProperty({ enum: LeadStatus, example: LeadStatus.CONTACTED })
  @IsEnum(LeadStatus)
  status!: LeadStatus;
}
