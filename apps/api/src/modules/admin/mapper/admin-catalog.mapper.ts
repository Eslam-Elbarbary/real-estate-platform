import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Feature,
  FinishingType,
  PropertyLegalStatus,
  PropertyType,
  PropertyView,
  TransactionType,
} from '@/prisma/generated/prisma-client';

export class AdminPropertyTypeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'APARTMENT' })
  code!: string;

  @ApiProperty({ example: 'Apartment' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'شقة' })
  nameAr!: string | null;

  @ApiProperty({ example: 0 })
  sortOrder!: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminTransactionTypeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'SALE' })
  code!: string;

  @ApiProperty({ example: 'Sale' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'بيع' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminFeatureDto {
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

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminPropertyViewDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'NILE' })
  code!: string;

  @ApiProperty({ example: 'Nile' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'النيل' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminPropertyLegalStatusDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'REGISTERED_MONTHLY' })
  code!: string;

  @ApiProperty({ example: 'Registered at the notary office' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'مسجل بالشهر العقاري' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminFinishingTypeDto {
  @ApiProperty({ enum: FinishingType, example: FinishingType.FINISHED })
  code!: FinishingType;

  @ApiProperty({ example: 'Finished' })
  nameEn!: string;

  @ApiProperty({ example: 'متشطب' })
  nameAr!: string;
}

const FINISHING_TYPE_LABELS: Record<
  FinishingType,
  { nameEn: string; nameAr: string }
> = {
  [FinishingType.UNFINISHED]: {
    nameEn: 'Unfinished',
    nameAr: 'بدون تشطيب',
  },
  [FinishingType.SEMI_FINISHED]: {
    nameEn: 'Semi-finished',
    nameAr: 'نصف تشطيب',
  },
  [FinishingType.FINISHED]: {
    nameEn: 'Finished',
    nameAr: 'متشطب',
  },
  [FinishingType.LUX]: {
    nameEn: 'Lux',
    nameAr: 'لوكس',
  },
  [FinishingType.SUPER_LUX]: {
    nameEn: 'Super Lux',
    nameAr: 'سوبر لوكس',
  },
};

export function toAdminPropertyType(row: PropertyType): AdminPropertyTypeDto {
  return {
    id: row.id,
    code: row.code,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toAdminTransactionType(
  row: TransactionType,
): AdminTransactionTypeDto {
  return {
    id: row.id,
    code: row.code,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toAdminFeature(row: Feature): AdminFeatureDto {
  return {
    id: row.id,
    code: row.code,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    category: row.category,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toAdminPropertyView(row: PropertyView): AdminPropertyViewDto {
  return {
    id: row.id,
    code: row.code,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toAdminPropertyLegalStatus(
  row: PropertyLegalStatus,
): AdminPropertyLegalStatusDto {
  return {
    id: row.id,
    code: row.code,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function listAdminFinishingTypes(): AdminFinishingTypeDto[] {
  return (Object.values(FinishingType) as FinishingType[]).map((code) => ({
    code,
    nameEn: FINISHING_TYPE_LABELS[code].nameEn,
    nameAr: FINISHING_TYPE_LABELS[code].nameAr,
  }));
}
