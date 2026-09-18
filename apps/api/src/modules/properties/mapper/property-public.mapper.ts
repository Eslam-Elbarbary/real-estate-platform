import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Area,
  City,
  Compound,
  Country,
  Developer,
  District,
  Feature,
  FinishingType,
  MediaAsset,
  MediaType,
  PaymentType,
  Property,
  PropertyContact,
  PropertyContactSource,
  PropertyContactType,
  PropertyImage,
  PropertyLegalStatus,
  PropertyType,
  PropertyView,
  RentPeriod,
  TransactionType,
  User,
} from '@/prisma/generated/prisma-client';
import { FeatureResponseDto, toFeatureResponse } from './feature.mapper';

export class PublicNamedRefDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;
}

/** Location entity ref with optional SEO slug (country has no slug in schema). */
export class PublicLocationRefDto extends PublicNamedRefDto {
  @ApiPropertyOptional({
    nullable: true,
    example: 'nasr-city',
    description: 'URL slug when available; null for entities without a slug (e.g. country)',
  })
  slug!: string | null;
}

export class PublicTypeRefDto extends PublicNamedRefDto {
  @ApiProperty()
  code!: string;
}

export class PublicLocationSummaryDto {
  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  country!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  city!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  area!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  district!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  compound!: PublicLocationRefDto | null;

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

export class PublicCoordinatesDto {
  @ApiPropertyOptional({ nullable: true, example: 30.0444 })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 31.2357 })
  longitude!: number | null;
}

export class PublicPropertyPaymentDto {
  @ApiPropertyOptional({ enum: PaymentType, nullable: true })
  type!: PaymentType | null;

  @ApiPropertyOptional({ nullable: true, example: 500000 })
  downPayment!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 8 })
  installmentYears!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 25000 })
  monthlyInstallment!: number | null;
}

export class PublicPropertyCardDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ nullable: true })
  referenceNumber!: string | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Derived as price / areaSqm when both are present',
  })
  pricePerSqm!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ enum: PaymentType, nullable: true })
  paymentType!: PaymentType | null;

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  finishingType!: FinishingType | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiProperty({ type: PublicLocationSummaryDto })
  location!: PublicLocationSummaryDto;

  @ApiProperty({ type: PublicCoordinatesDto })
  coordinates!: PublicCoordinatesDto;

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
  id!: string;

  @ApiProperty()
  mediaAssetId!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ enum: MediaType })
  type!: MediaType;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  isPrimary!: boolean;
}

export class PublicPropertyContactDto {
  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiProperty({
    enum: PropertyContactType,
    description: 'Public contact role (OWNER | AGENT | COMPANY)',
  })
  type!: PropertyContactType;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  whatsapp!: string | null;
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
  referenceNumber!: string | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Derived as price / areaSqm when both are present',
  })
  pricePerSqm!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ type: PublicPropertyPaymentDto })
  payment!: PublicPropertyPaymentDto;

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  finishingType!: FinishingType | null;

  @ApiPropertyOptional({ enum: RentPeriod, nullable: true })
  rentPeriod!: RentPeriod | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiProperty({ type: [PublicTypeRefDto] })
  propertyViews!: PublicTypeRefDto[];

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  legalStatus!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  country!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  city!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  area!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  district!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  compound!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  developer!: PublicLocationRefDto | null;

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

  @ApiProperty({ example: 0 })
  viewCount!: number;

  @ApiProperty({ example: 0 })
  favoritesCount!: number;

  @ApiProperty({ type: [PublicPropertyImageDto] })
  images!: PublicPropertyImageDto[];

  @ApiProperty({ type: [FeatureResponseDto] })
  features!: FeatureResponseDto[];

  @ApiProperty({ type: PublicOwnerCardDto })
  owner!: PublicOwnerCardDto;

  @ApiProperty({ type: PublicPropertyContactDto })
  contact!: PublicPropertyContactDto;

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
  compound?: Compound | null;
  images: Array<PropertyImage & { mediaAsset: MediaAsset }>;
};

export type PropertyDetailsSource = PropertyCardSource & {
  compound: (Compound & { developer: Developer | null }) | null;
  viewAssignments?: Array<{ view: PropertyView }>;
  legalStatus?: PropertyLegalStatus | null;
  owner: User;
  contact: PropertyContact | null;
  features: Array<{ feature: Feature }>;
  _count: { favorites: number };
};

type DecimalLike =
  | Property['price']
  | Property['areaSqm']
  | Property['latitude']
  | Property['longitude']
  | Property['downPayment']
  | Property['monthlyInstallment'];

function decimalToNumber(value: DecimalLike): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}

function computePricePerSqm(
  price: DecimalLike,
  areaSqm: DecimalLike,
): number | null {
  const priceNumber = decimalToNumber(price);
  const areaNumber = decimalToNumber(areaSqm);
  if (priceNumber == null || areaNumber == null || areaNumber <= 0) {
    return null;
  }
  return Math.round(priceNumber / areaNumber);
}

function dateToIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function toLocationRef(
  entity:
    | { id: string; nameEn: string; nameAr: string | null; slug?: string | null }
    | null
    | undefined,
): PublicLocationRefDto | null {
  if (!entity) {
    return null;
  }
  return {
    id: entity.id,
    nameEn: entity.nameEn,
    nameAr: entity.nameAr,
    slug: entity.slug ?? null,
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
  compound: Compound | null = null,
): PublicLocationSummaryDto {
  const country = area?.city.country ?? null;
  const city = area?.city ?? null;
  const parts = [
    compound?.nameEn,
    district?.nameEn,
    area?.nameEn,
    city?.nameEn,
  ].filter(Boolean);

  return {
    country: toLocationRef(country),
    city: toLocationRef(city),
    area: toLocationRef(area),
    district: toLocationRef(district),
    compound: toLocationRef(compound),
    summary: parts.join(', '),
  };
}

function toCoordinates(property: Property): PublicCoordinatesDto {
  return {
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
  };
}

function toPayment(property: Property): PublicPropertyPaymentDto {
  return {
    type: property.paymentType,
    downPayment: decimalToNumber(property.downPayment),
    installmentYears: property.installmentYears,
    monthlyInstallment: decimalToNumber(property.monthlyInstallment),
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

export function toPublicPropertyContact(
  _propertyId: string,
  owner: User,
  row: PropertyContact | null,
): PublicPropertyContactDto {
  const source = row?.source ?? PropertyContactSource.OWNER;
  if (source === PropertyContactSource.CUSTOM && row) {
    return {
      name: row.name,
      type: row.contactType,
      phone: row.phone,
      whatsapp: row.whatsapp ?? row.phone,
    };
  }

  const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim();
  return {
    name: name || null,
    type: PropertyContactType.OWNER,
    phone: owner.phone,
    whatsapp: owner.phone,
  };
}

export function toPublicPropertyCard(
  property: PropertyCardSource,
): PublicPropertyCardDto {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    referenceNumber: property.referenceNumber,
    price: decimalToNumber(property.price),
    pricePerSqm: computePricePerSqm(property.price, property.areaSqm),
    currency: property.currency,
    paymentType: property.paymentType,
    finishingType: property.finishingType,
    transactionType: toTypeRef(property.transactionType),
    propertyType: toTypeRef(property.propertyType),
    location: toLocationSummary(
      property.area,
      property.district,
      property.compound ?? null,
    ),
    coordinates: toCoordinates(property),
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
  const location = toLocationSummary(
    property.area,
    property.district,
    property.compound,
  );

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    referenceNumber: property.referenceNumber,
    price: decimalToNumber(property.price),
    pricePerSqm: computePricePerSqm(property.price, property.areaSqm),
    currency: property.currency,
    payment: toPayment(property),
    finishingType: property.finishingType,
    rentPeriod: property.rentPeriod,
    propertyType: toTypeRef(property.propertyType),
    transactionType: toTypeRef(property.transactionType),
    propertyViews: (property.viewAssignments ?? [])
      .map(({ view }) => ({
        id: view.id,
        code: view.code,
        nameEn: view.nameEn,
        nameAr: view.nameAr,
      }))
      .sort((a, b) => a.nameEn.localeCompare(b.nameEn)),
    legalStatus: toTypeRef(property.legalStatus),
    country: location.country,
    city: location.city,
    area: location.area,
    district: location.district,
    compound: toLocationRef(property.compound),
    developer: toLocationRef(property.compound?.developer ?? null),
    address: property.address,
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    floor: property.floor,
    yearBuilt: property.yearBuilt,
    furnished: property.furnished,
    viewCount: property.viewCount,
    favoritesCount: property._count.favorites,
    images: [...property.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({
        id: img.id,
        mediaAssetId: img.mediaAssetId,
        url: img.mediaAsset.url,
        type: img.type,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
      })),
    features: property.features.map((row) => toFeatureResponse(row.feature)),
    owner: toPublicOwnerCard(property.owner),
    contact: toPublicPropertyContact(
      property.id,
      property.owner,
      property.contact,
    ),
    similar: similar.map(toPublicPropertyCard),
    publishedAt: dateToIso(property.publishedAt),
  };
}
