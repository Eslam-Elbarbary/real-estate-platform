import { ApiPropertyOptional } from '@nestjs/swagger';
import { FinishingType, PaymentType } from '@prisma/client';
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
  ValidateNested,
} from 'class-validator';
import { AdminPropertyImageInputDto } from './admin-property-image-input.dto';

export class UpdateAdminPropertyDto {
  @ApiPropertyOptional({ example: 'Bright apartment in Nasr City' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 'Luxury apartment with modern finishing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionTypeId?: string;

  @ApiPropertyOptional({ example: 3500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'EGP' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: 'REF-1001', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceNumber?: string | null;

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

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  @IsOptional()
  @IsEnum(FinishingType)
  finishingType?: FinishingType | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  furnished?: boolean | null;

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

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1800)
  yearBuilt?: number | null;

  @ApiPropertyOptional({ description: 'Used to validate area hierarchy' })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiPropertyOptional({ description: 'Used to validate area hierarchy' })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  districtId?: string | null;

  @ApiPropertyOptional({ nullable: true, description: 'Optional compound association' })
  @IsOptional()
  @IsString()
  compoundId?: string | null;

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

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  featureIds?: string[];

  @ApiPropertyOptional({ type: [AdminPropertyImageInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPropertyImageInputDto)
  images?: AdminPropertyImageInputDto[];
}
