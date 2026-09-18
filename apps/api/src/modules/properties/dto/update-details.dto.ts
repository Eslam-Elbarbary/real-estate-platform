import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  FinishingType,
  RentPeriod,
} from '@/prisma/generated/prisma-client';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateDetailsDto {
  @ApiPropertyOptional({ example: 3, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms?: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bathrooms?: number | null;

  @ApiPropertyOptional({ example: 150, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number | null;

  @ApiPropertyOptional({ example: 5, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  floor?: number | null;

  @ApiPropertyOptional({ example: 2018, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @Max(2100)
  yearBuilt?: number | null;

  @ApiPropertyOptional({ example: true, nullable: true })
  @IsOptional()
  @IsBoolean()
  furnished?: boolean | null;

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  @IsOptional()
  @IsEnum(FinishingType)
  finishingType?: FinishingType | null;

  @ApiPropertyOptional({ enum: RentPeriod, nullable: true })
  @IsOptional()
  @IsEnum(RentPeriod)
  rentPeriod?: RentPeriod | null;

  @ApiPropertyOptional({
    type: [String],
    description:
      'PropertyView catalog ids (active only). Replaces the full selection.',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  propertyViewIds?: string[];

  @ApiPropertyOptional({
    nullable: true,
    description: 'PropertyLegalStatus catalog id (active only)',
  })
  @IsOptional()
  @IsString()
  legalStatusId?: string | null;
}
