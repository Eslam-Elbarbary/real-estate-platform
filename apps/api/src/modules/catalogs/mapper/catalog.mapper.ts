import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Feature, PropertyType, TransactionType } from '@prisma/client';

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
