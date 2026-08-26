import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Area,
  City,
  Compound,
  Country,
  District,
  Feature,
  MediaAsset,
  Property,
  PropertyImage,
  PropertyType,
  TransactionType,
  User,
} from '@prisma/client';
import { FeatureResponseDto, toFeatureResponse } from './feature.mapper';

export class PublicNamedRefDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;
}

export class PublicTypeRefDto extends PublicNamedRefDto {
  @ApiProperty()
  code!: string;
}

export class PublicLocationSummaryDto {
  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  country!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  city!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  area!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  district!: PublicNamedRefDto | null;

  @ApiProperty({
    example: 'Nasr City, Cairo',
    description: 'Short display string for cards',
  })
  summary!: string;
}

export class PublicPrimaryImageDto {
  @ApiProperty()
  url!: string;

  @ApiProperty()
  isPrimary!: boolean;

  @ApiProperty()
  sortOrder!: number;
}

export class PublicPropertyCardDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiProperty({ type: PublicLocationSummaryDto })
  location!: PublicLocationSummaryDto;

  @ApiPropertyOptional({ type: PublicPrimaryImageDto, nullable: true })
  primaryImage!: PublicPrimaryImageDto | null;

  @ApiPropertyOptional({ nullable: true })
  bedrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bathrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  areaSqm!: number | null;

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: string | null;
}

export class PublicPropertyImageDto {
  @ApiProperty()
  url!: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  isPrimary!: boolean;
}

export class PublicOwnerCardDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl!: string | null;
}

export class PublicPropertyDetailsDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  country!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  city!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  area!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  district!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ type: PublicNamedRefDto, nullable: true })
  compound!: PublicNamedRefDto | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bedrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bathrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  areaSqm!: number | null;

  @ApiPropertyOptional({ nullable: true })
  floor!: number | null;

  @ApiPropertyOptional({ nullable: true })
  yearBuilt!: number | null;

  @ApiPropertyOptional({ nullable: true })
  furnished!: boolean | null;

  @ApiProperty({ type: [PublicPropertyImageDto] })
  images!: PublicPropertyImageDto[];

  @ApiProperty({ type: [FeatureResponseDto] })
  features!: FeatureResponseDto[];

  @ApiProperty({ type: PublicOwnerCardDto })
  owner!: PublicOwnerCardDto;

  @ApiProperty({ type: [PublicPropertyCardDto] })
  similar!: PublicPropertyCardDto[];

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: string | null;
}

export type AreaWithCityCountry = Area & {
  city: City & { country: Country };
};

export type PropertyCardSource = Property & {
  propertyType: PropertyType | null;
  transactionType: TransactionType | null;
  area: AreaWithCityCountry | null;
  district: District | null;
  images: Array<PropertyImage & { mediaAsset: MediaAsset }>;
};

export type PropertyDetailsSource = PropertyCardSource & {
  compound: Compound | null;
  owner: User;
  features: Array<{ feature: Feature }>;
};

function decimalToNumber(
  value: Property['price'] | Property['areaSqm'] | Property['latitude'] | Property['longitude'],
): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}

function dateToIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
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

function toTypeRef(
  entity: { id: string; code: string; nameEn: string; nameAr: string | null } | null | undefined,
): PublicTypeRefDto | null {
  if (!entity) {
    return null;
  }
  return {
    id: entity.id,
    code: entity.code,
    nameEn: entity.nameEn,
    nameAr: entity.nameAr,
  };
}

function toLocationSummary(
  area: AreaWithCityCountry | null,
  district: District | null,
): PublicLocationSummaryDto {
  const country = area?.city.country ?? null;
  const city = area?.city ?? null;
  const parts = [area?.nameEn, city?.nameEn].filter(Boolean);

  return {
    country: toNamedRef(country),
    city: toNamedRef(city),
    area: toNamedRef(area),
    district: toNamedRef(district),
    summary: parts.join(', '),
  };
}

function pickPrimaryImage(
  images: Array<PropertyImage & { mediaAsset: MediaAsset }>,
): PublicPrimaryImageDto | null {
  if (images.length === 0) {
    return null;
  }
  const primary = images.find((img) => img.isPrimary) ?? images[0];
  return {
    url: primary.mediaAsset.url,
    isPrimary: primary.isPrimary,
    sortOrder: primary.sortOrder,
  };
}

export function toPublicOwnerCard(owner: User): PublicOwnerCardDto {
  const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim();
  return {
    id: owner.id,
    name: name || null,
    avatarUrl: owner.avatarUrl,
  };
}

export function toPublicPropertyCard(
  property: PropertyCardSource,
): PublicPropertyCardDto {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    price: decimalToNumber(property.price),
    currency: property.currency,
    transactionType: toTypeRef(property.transactionType),
    propertyType: toTypeRef(property.propertyType),
    location: toLocationSummary(property.area, property.district),
    primaryImage: pickPrimaryImage(property.images),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    publishedAt: dateToIso(property.publishedAt),
  };
}

export function toPublicPropertyDetails(
  property: PropertyDetailsSource,
  similar: PropertyCardSource[],
): PublicPropertyDetailsDto {
  const location = toLocationSummary(property.area, property.district);

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    price: decimalToNumber(property.price),
    currency: property.currency,
    propertyType: toTypeRef(property.propertyType),
    transactionType: toTypeRef(property.transactionType),
    country: location.country,
    city: location.city,
    area: location.area,
    district: location.district,
    compound: toNamedRef(property.compound),
    address: property.address,
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    floor: property.floor,
    yearBuilt: property.yearBuilt,
    furnished: property.furnished,
    images: [...property.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({
        url: img.mediaAsset.url,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
      })),
    features: property.features.map((row) => toFeatureResponse(row.feature)),
    owner: toPublicOwnerCard(property.owner),
    similar: similar.map(toPublicPropertyCard),
    publishedAt: dateToIso(property.publishedAt),
  };
}
