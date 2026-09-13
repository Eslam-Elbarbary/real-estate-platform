import { ApiPropertyOptional } from '@nestjs/swagger';
import { PlanStatus } from '@/prisma/generated/prisma-client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdatePlanDto {
  @ApiPropertyOptional({ example: 'PREMIUM_PLUS' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'code must be uppercase letters, numbers, or underscores',
  })
  code?: string;

  @ApiPropertyOptional({ example: 'Premium Plus' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 599, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 45, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays?: number;

  @ApiPropertyOptional({
    description: 'Plan feature payload (JSON object)',
    example: { listingLimit: 5, featuredBoost: true },
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: PlanStatus })
  @IsOptional()
  @IsEnum(PlanStatus)
  status?: PlanStatus;
}
