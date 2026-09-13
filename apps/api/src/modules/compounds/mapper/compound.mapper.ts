import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area, City, Compound, Country, Developer, Prisma } from '@/prisma/generated/prisma-client';
import {
  PublicNamedRefDto,
  PublicPropertyCardDto,
  PropertyCardSource,
  toPublicPropertyCard,
} from '../../properties/mapper/property-public.mapper';

export class PublicDeveloperSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;
}

export class PublicCompoundLocationDto {
  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  country!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  city!: PublicNamedRefDto | null;

  @ApiProperty({ type: PublicNamedRefDto })
  area!: PublicNamedRefDto;
}

export class PublicCompoundCardDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  coverUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude!: number | null;

  @ApiPropertyOptional({ type: PublicDeveloperSummaryDto, nullable: true })
  developer!: PublicDeveloperSummaryDto | null;

  @ApiProperty({ type: PublicCompoundLocationDto })
  location!: PublicCompoundLocationDto;

  @ApiProperty({ example: 8 })
  publishedPropertyCount!: number;
}

export class PublicCompoundDetailsDto extends PublicCompoundCardDto {
  @ApiProperty({ type: [PublicPropertyCardDto] })
  properties!: PublicPropertyCardDto[];
}

export class AdminCompoundDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  developerId!: string | null;

  @ApiProperty()
  areaId!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  coverUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  coverPublicId!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiProperty({ example: 4 })
  publishedPropertyCount!: number;
}

export class AdminCompoundDetailsDto extends AdminCompoundDto {
  @ApiPropertyOptional({ type: PublicDeveloperSummaryDto, nullable: true })
  developer!: PublicDeveloperSummaryDto | null;

  @ApiProperty({ type: PublicCompoundLocationDto })
  location!: PublicCompoundLocationDto;
}

type AreaWithCityCountry = Area & {
  city: City & { country: Country };
};

export type CompoundCardSource = Compound & {
  developer: Developer | null;
  area: AreaWithCityCountry;
};

function decimalToNumber(
  value: Compound['latitude'] | Compound['longitude'],
): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}

function toNamedRef(
  entity: { id: string; nameEn: string; nameAr: string | null } | null | undefined,
): PublicNamedRefDto | null {
  if (!entity) {
    return null;
  }
  return {
    id: entity.id,
    nameEn: entity.nameEn,
    nameAr: entity.nameAr,
  };
}

export function toPublicDeveloperSummary(
  developer: Developer | null | undefined,
): PublicDeveloperSummaryDto | null {
  if (!developer || !developer.isActive) {
    return null;
  }

  return {
    id: developer.id,
    slug: developer.slug,
    nameEn: developer.nameEn,
    nameAr: developer.nameAr,
    logoUrl: developer.logoUrl,
  };
}

export function toPublicCompoundLocation(
  area: AreaWithCityCountry,
): PublicCompoundLocationDto {
  return {
    country: toNamedRef(area.city.country),
    city: toNamedRef(area.city),
    area: toNamedRef(area)!,
  };
}

export function toPublicCompoundCard(
  compound: CompoundCardSource,
  publishedPropertyCount: number,
): PublicCompoundCardDto {
  return {
    id: compound.id,
    slug: compound.slug,
    nameEn: compound.nameEn,
    nameAr: compound.nameAr,
    description: compound.description,
    coverUrl: compound.coverUrl,
    latitude: decimalToNumber(compound.latitude),
    longitude: decimalToNumber(compound.longitude),
    developer: toPublicDeveloperSummary(compound.developer),
    location: toPublicCompoundLocation(compound.area),
    publishedPropertyCount,
  };
}

export function toPublicCompoundDetails(
  compound: CompoundCardSource,
  publishedPropertyCount: number,
  properties: PropertyCardSource[],
): PublicCompoundDetailsDto {
  return {
    ...toPublicCompoundCard(compound, publishedPropertyCount),
    properties: properties.map(toPublicPropertyCard),
  };
}

export function toAdminCompound(
  compound: Compound,
  publishedPropertyCount: number,
): AdminCompoundDto {
  return {
    id: compound.id,
    developerId: compound.developerId,
    areaId: compound.areaId,
    slug: compound.slug,
    nameEn: compound.nameEn,
    nameAr: compound.nameAr,
    description: compound.description,
    latitude: decimalToNumber(compound.latitude),
    longitude: decimalToNumber(compound.longitude),
    coverUrl: compound.coverUrl,
    coverPublicId: compound.coverPublicId,
    isActive: compound.isActive,
    createdAt: compound.createdAt.toISOString(),
    updatedAt: compound.updatedAt.toISOString(),
    publishedPropertyCount,
  };
}

export function toAdminCompoundDetails(
  compound: CompoundCardSource,
  publishedPropertyCount: number,
): AdminCompoundDetailsDto {
  return {
    ...toAdminCompound(compound, publishedPropertyCount),
    developer: toPublicDeveloperSummary(compound.developer),
    location: toPublicCompoundLocation(compound.area),
  };
}

export function buildCompoundPublicWhere(
  filters: {
    search?: string;
    developerId?: string;
    areaId?: string;
    cityId?: string;
  },
): Prisma.CompoundWhereInput {
  const andConditions: Prisma.CompoundWhereInput[] = [
    { isActive: true },
    {
      OR: [{ developerId: null }, { developer: { isActive: true } }],
    },
  ];

  if (filters.developerId) {
    andConditions.push({
      developerId: filters.developerId,
      developer: { isActive: true },
    });
  }

  if (filters.areaId) {
    andConditions.push({ areaId: filters.areaId });
  }

  if (filters.cityId) {
    andConditions.push({ area: { cityId: filters.cityId } });
  }

  if (filters.search?.trim()) {
    const term = filters.search.trim();
    andConditions.push({
      OR: [
        { nameEn: { contains: term, mode: 'insensitive' } },
        { nameAr: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ],
    });
  }

  return { AND: andConditions };
}

export function buildCompoundAdminWhere(
  filters: {
    search?: string;
    developerId?: string;
    areaId?: string;
    isActive?: boolean;
  },
): Prisma.CompoundWhereInput {
  const where: Prisma.CompoundWhereInput = {};

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.developerId) {
    where.developerId = filters.developerId;
  }

  if (filters.areaId) {
    where.areaId = filters.areaId;
  }

  if (filters.search?.trim()) {
    const term = filters.search.trim();
    where.OR = [
      { nameEn: { contains: term, mode: 'insensitive' } },
      { nameAr: { contains: term, mode: 'insensitive' } },
      { slug: { contains: term, mode: 'insensitive' } },
    ];
  }

  return where;
}

export const COMPOUND_CARD_INCLUDE = {
  developer: true,
  area: {
    include: {
      city: {
        include: { country: true },
      },
    },
  },
} satisfies Prisma.CompoundInclude;

export const COMPOUND_PROPERTY_CARD_INCLUDE = {
  propertyType: true,
  transactionType: true,
  area: {
    include: {
      city: {
        include: { country: true },
      },
    },
  },
  district: true,
  images: {
    include: { mediaAsset: true },
    orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }],
  },
} satisfies Prisma.PropertyInclude;

export const COMPOUND_DETAIL_PROPERTY_LIMIT = 12;
