import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FinishingType, PaymentType, RentPeriod } from '@/prisma/generated/prisma-client';
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
import { UpsertPropertyContactDto } from '../../properties/dto/upsert-property-contact.dto';

export class CreateAdminPropertyDto {
  @ApiProperty({ description: 'Property owner user id' })
  @IsString()
  ownerId!: string;

  @ApiProperty({ example: 'Bright apartment in Nasr City' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'Luxury apartment with modern finishing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty()
  @IsString()
  propertyTypeId!: string;

  @ApiProperty()
  @IsString()
  transactionTypeId!: string;

  @ApiProperty({ example: 3500000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 'EGP', default: 'EGP' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: 'REF-1001' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceNumber?: string;

  @ApiPropertyOptional({ enum: PaymentType })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  downPayment?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  installmentYears?: number;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyInstallment?: number;

  @ApiPropertyOptional({ enum: FinishingType })
  @IsOptional()
  @IsEnum(FinishingType)
  finishingType?: FinishingType;

  @ApiPropertyOptional({ enum: RentPeriod })
  @IsOptional()
  @IsEnum(RentPeriod)
  rentPeriod?: RentPeriod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1800)
  yearBuilt?: number;

  @ApiPropertyOptional({ description: 'Used to validate area hierarchy' })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiPropertyOptional({ description: 'Used to validate area hierarchy' })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiProperty()
  @IsString()
  areaId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Optional compound association' })
  @IsOptional()
  @IsString()
  compoundId?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'PropertyView catalog ids (active only)',
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
  address?: string;

  @ApiPropertyOptional({ example: 30.0444 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 31.2357 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

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

  @ApiPropertyOptional({
    description: 'Optional listing contact. When omitted on publish, OWNER contact is created.',
    type: () => UpsertPropertyContactDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpsertPropertyContactDto)
  contact?: UpsertPropertyContactDto;

  @ApiPropertyOptional({
    description:
      'When false, create as DRAFT. When omitted or true, create as PUBLISHED (backward compatible).',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  publish?: boolean;
}
