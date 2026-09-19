import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area, City, Country, District } from '@/prisma/generated/prisma-client';

export class AdminCountryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'EG' })
  code!: string;

  @ApiProperty({ example: 'Egypt' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'مصر' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminCityDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  countryId!: string;

  @ApiProperty({ example: 'cairo' })
  slug!: string;

  @ApiProperty({ example: 'Cairo' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'القاهرة' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminAreaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  cityId!: string;

  @ApiProperty({ example: 'new-cairo' })
  slug!: string;

  @ApiProperty({ example: 'New Cairo' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'القاهرة الجديدة' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminDistrictDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  areaId!: string;

  @ApiProperty({ example: 'fifth-settlement' })
  slug!: string;

  @ApiProperty({ example: 'Fifth Settlement' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true, example: 'التجمع الخامس' })
  nameAr!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export function toAdminCountry(row: Country): AdminCountryDto {
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

export function toAdminCity(row: City): AdminCityDto {
  return {
    id: row.id,
    countryId: row.countryId,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toAdminArea(row: Area): AdminAreaDto {
  return {
    id: row.id,
    cityId: row.cityId,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toAdminDistrict(row: District): AdminDistrictDto {
  return {
    id: row.id,
    areaId: row.areaId,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
