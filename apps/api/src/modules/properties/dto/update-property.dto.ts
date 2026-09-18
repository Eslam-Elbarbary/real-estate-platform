import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentType,
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
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Patch body for draft properties only.
 * ownerId, slug, and status are never accepted from the client.
 */
export class UpdatePropertyDto {
  @ApiPropertyOptional({ example: 'Bright apartment in Nasr City' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 'Luxury apartment in New Cairo with modern finishing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  districtId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  compoundId?: string | null;

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

  @ApiPropertyOptional({ example: '12 Abbas El Akkad St' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @ApiPropertyOptional({ example: 30.0444 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number | null;

  @ApiPropertyOptional({ example: 31.2357 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number | null;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number | null;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number | null;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number | null;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  floor?: number | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  furnished?: boolean | null;

  @ApiPropertyOptional({ enum: RentPeriod, nullable: true })
  @IsOptional()
  @IsEnum(RentPeriod)
  rentPeriod?: RentPeriod | null;

  @ApiPropertyOptional({ example: 3500000, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number | null;

  @ApiPropertyOptional({ example: 'EGP' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ enum: PaymentType, nullable: true })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType | null;

  @ApiPropertyOptional({ example: 500000, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  downPayment?: number | null;

  @ApiPropertyOptional({ example: 8, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  installmentYears?: number | null;

  @ApiPropertyOptional({ example: 25000, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyInstallment?: number | null;
}
