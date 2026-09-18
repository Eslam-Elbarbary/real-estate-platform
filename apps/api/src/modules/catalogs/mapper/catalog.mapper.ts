import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Feature,
  PropertyLegalStatus,
  PropertyType,
  PropertyView,
  TransactionType,
} from '@/prisma/generated/prisma-client';

export class CatalogPropertyTypeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'APARTMENT' })
  code!: string;

  @ApiProperty({ example: 'Apartment' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'شقة' })
  nameAr!: string | null;
}

export class CatalogTransactionTypeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'SALE' })
  code!: string;

  @ApiProperty({ example: 'Sale' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'بيع' })
  nameAr!: string | null;
}

export class CatalogFeatureDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'PARKING' })
  code!: string;

  @ApiProperty({ example: 'Parking' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'موقف سيارات' })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'amenities' })
  category!: string | null;
}

export class CatalogPropertyViewDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'NILE' })
  code!: string;

  @ApiProperty({ example: 'Nile' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'النيل' })
  nameAr!: string | null;
}

export class CatalogLegalStatusDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'REGISTERED_MONTHLY' })
  code!: string;

  @ApiProperty({ example: 'Registered at the notary office' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'مسجل بالشهر العقاري' })
  nameAr!: string | null;
}

export function toCatalogPropertyType(type: PropertyType): CatalogPropertyTypeDto {
  return {
    id: type.id,
    code: type.code,
    nameEn: type.nameEn,
    nameAr: type.nameAr,
  };
}

export function toCatalogTransactionType(
  type: TransactionType,
): CatalogTransactionTypeDto {
  return {
    id: type.id,
    code: type.code,
    nameEn: type.nameEn,
    nameAr: type.nameAr,
  };
}

export function toCatalogFeature(feature: Feature): CatalogFeatureDto {
  return {
    id: feature.id,
    code: feature.code,
    nameEn: feature.nameEn,
    nameAr: feature.nameAr,
    category: feature.category,
  };
}

export function toCatalogPropertyView(view: PropertyView): CatalogPropertyViewDto {
  return {
    id: view.id,
    code: view.code,
    nameEn: view.nameEn,
    nameAr: view.nameAr,
  };
}

export function toCatalogLegalStatus(
  status: PropertyLegalStatus,
): CatalogLegalStatusDto {
  return {
    id: status.id,
    code: status.code,
    nameEn: status.nameEn,
    nameAr: status.nameAr,
  };
}
