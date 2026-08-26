import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ enum: LeadType, example: LeadType.CONTACT_FORM })
  @IsEnum(LeadType)
  type!: LeadType;

  @ApiPropertyOptional({ example: 'Is the price negotiable?' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
