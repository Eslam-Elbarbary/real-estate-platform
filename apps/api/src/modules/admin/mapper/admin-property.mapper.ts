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
  Payment,
  PaymentStatus,
  PaymentType,
  Plan,
  Property,
  PropertyImage,
  PropertyStatus,
  PropertyStatusHistory,
  PropertyType,
  RentPeriod,
  Subscription,
  TransactionType,
  User,
} from '@/prisma/generated/prisma-client';
import { FeatureResponseDto, toFeatureResponse } from '../../properties/mapper/feature.mapper';
import {
  PublicLocationRefDto,
  PublicLocationSummaryDto,
  PublicPrimaryImageDto,
  PublicTypeRefDto,
} from '../../properties/mapper/property-public.mapper';
import {
  SubscriptionResponseDto,
  toSubscriptionResponse,
} from '../../subscriptions/mapper/subscription.mapper';

export class AdminPropertyOwnerDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiProperty()
  email!: string;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl!: string | null;
}

export class AdminPropertyReviewCardDto {
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

  @ApiProperty()
  currency!: string;

  @ApiProperty({ enum: PropertyStatus })
  status!: PropertyStatus;

  @ApiPropertyOptional({ enum: PaymentType, nullable: true })
  paymentType!: PaymentType | null;

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  finishingType!: FinishingType | null;

  @ApiPropertyOptional({ nullable: true })
  bedrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bathrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  areaSqm!: number | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiProperty({ type: PublicLocationSummaryDto })
  location!: PublicLocationSummaryDto;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  compound!: PublicLocationRefDto | null;

  @ApiProperty({ type: AdminPropertyOwnerDto })
  owner!: AdminPropertyOwnerDto;

  @ApiPropertyOptional({ type: PublicPrimaryImageDto, nullable: true })
  primaryImage!: PublicPrimaryImageDto | null;

  @ApiProperty({ example: 0 })
  imageCount!: number;

  @ApiProperty({ example: 0 })
  videoCount!: number;

  @ApiProperty({ example: 0 })
  viewCount!: number;

  @ApiProperty({ example: 0 })
  favoritesCount!: number;

  @ApiPropertyOptional({ nullable: true })
  submittedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class AdminPropertyImageDto {
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

export class AdminPropertyStatusHistoryDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ enum: PropertyStatus, nullable: true })
  fromStatus!: PropertyStatus | null;

  @ApiProperty({ enum: PropertyStatus })
  toStatus!: PropertyStatus;

  @ApiPropertyOptional({ nullable: true })
  reason!: string | null;

  @ApiPropertyOptional({ nullable: true })
  changedById!: string | null;

  @ApiPropertyOptional({ nullable: true })
  changedByName!: string | null;

  @ApiProperty()
  createdAt!: string;
}

export class AdminPropertyPaymentSummaryDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  successful!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  failed!: number;

  @ApiProperty()
  totalPaid!: number;
}

export class AdminPropertyReviewDetailsDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'REF-1001' })
  referenceNumber!: string | null;

  @ApiProperty({ enum: PropertyStatus })
  status!: PropertyStatus;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Derived as price / areaSqm when both are present and positive',
  })
  pricePerSqm!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ enum: PaymentType, nullable: true })
  paymentType!: PaymentType | null;

  @ApiPropertyOptional({ nullable: true, example: 500000 })
  downPayment!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 8 })
  installmentYears!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 25000 })
  monthlyInstallment!: number | null;

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  finishingType!: FinishingType | null;

  @ApiPropertyOptional({ enum: RentPeriod, nullable: true })
  rentPeriod!: RentPeriod | null;

  @ApiPropertyOptional({ nullable: true })
  furnished!: boolean | null;

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
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude!: number | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiProperty({ type: PublicLocationSummaryDto })
  location!: PublicLocationSummaryDto;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  compound!: PublicLocationRefDto | null;

  @ApiPropertyOptional({ type: PublicLocationRefDto, nullable: true })
  developer!: PublicLocationRefDto | null;

  @ApiProperty({ example: 0 })
  viewCount!: number;

  @ApiProperty({ example: 0 })
  favoritesCount!: number;

  @ApiProperty({ type: AdminPropertyOwnerDto })
  owner!: AdminPropertyOwnerDto;

  @ApiProperty({ type: [AdminPropertyImageDto] })
  images!: AdminPropertyImageDto[];

  @ApiProperty({ type: [FeatureResponseDto] })
  features!: FeatureResponseDto[];

  @ApiProperty({ type: [SubscriptionResponseDto] })
  subscriptions!: SubscriptionResponseDto[];

  @ApiProperty({ type: AdminPropertyPaymentSummaryDto })
  paymentSummary!: AdminPropertyPaymentSummaryDto;

  @ApiProperty({ type: [AdminPropertyStatusHistoryDto] })
  statusHistory!: AdminPropertyStatusHistoryDto[];

  @ApiPropertyOptional({ nullable: true })
  submittedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  reviewedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  reviewedById!: string | null;

  @ApiPropertyOptional({ nullable: true })
  reviewedByName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  rejectedReason!: string | null;

  @ApiPropertyOptional({ nullable: true })
  archivedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

type AreaWithCityCountry = Area & {
  city: City & { country: Country };
};

export type AdminPropertyCardSource = Property & {
  propertyType: PropertyType | null;
  transactionType: TransactionType | null;
  area: AreaWithCityCountry | null;
  district: District | null;
  compound: (Compound & { developer: Developer | null }) | null;
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'avatarUrl'>;
  images: Array<
    Pick<PropertyImage, 'type' | 'isPrimary' | 'sortOrder'> & {
      mediaAsset: Pick<MediaAsset, 'url'>;
    }
  >;
  _count: { favorites: number };
};

export type AdminPropertyDetailsSource = Omit<AdminPropertyCardSource, 'images'> & {
  features: Array<{ feature: Feature }>;
  images: Array<PropertyImage & { mediaAsset: MediaAsset }>;
  subscriptions: Array<Subscription & { plan: Plan }>;
  statusHistory: Array<
    PropertyStatusHistory & {
      changedBy: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
    }
  >;
  reviewedBy: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  payments: Payment[];
};

function decimalToNumber(
  value:
    | Property['price']
    | Property['areaSqm']
    | Property['latitude']
    | Property['longitude']
    | Property['downPayment']
    | Property['monthlyInstallment'],
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

function toOwnerDto(
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'avatarUrl'>,
): AdminPropertyOwnerDto {
  const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || null;
  return {
    id: owner.id,
    name,
    email: owner.email,
    phone: owner.phone,
    avatarUrl: owner.avatarUrl,
  };
}

function toUserDisplayName(
  user: Pick<User, 'firstName' | 'lastName'> | null | undefined,
): string | null {
  if (!user) {
    return null;
  }
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || null;
}

function computePricePerSqm(
  price: Property['price'],
  areaSqm: Property['areaSqm'],
): number | null {
  const priceNumber = decimalToNumber(price);
  const areaNumber = decimalToNumber(areaSqm);
  if (
    priceNumber == null ||
    areaNumber == null ||
    priceNumber <= 0 ||
    areaNumber <= 0
  ) {
    return null;
  }
  return Math.round(priceNumber / areaNumber);
}

function pickPrimaryImage(
  images: AdminPropertyCardSource['images'],
): PublicPrimaryImageDto | null {
  if (!images.length) {
    return null;
  }
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primary = sorted.find((img) => img.isPrimary) ?? sorted[0];
  if (!primary) {
    return null;
  }
  return {
    url: primary.mediaAsset.url,
    isPrimary: primary.isPrimary,
    sortOrder: primary.sortOrder,
  };
}

export function toAdminPropertyReviewCard(
  property: AdminPropertyCardSource,
): AdminPropertyReviewCardDto {
  const imageCount = property.images.filter(
    (image) => image.type === MediaType.IMAGE,
  ).length;
  const videoCount = property.images.filter(
    (image) => image.type === MediaType.VIDEO,
  ).length;

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    referenceNumber: property.referenceNumber,
    price: decimalToNumber(property.price),
    currency: property.currency,
    status: property.status,
    paymentType: property.paymentType,
    finishingType: property.finishingType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    propertyType: toTypeRef(property.propertyType),
    transactionType: toTypeRef(property.transactionType),
    location: toLocationSummary(property.area, property.district),
    compound: toNamedRef(property.compound),
    owner: toOwnerDto(property.owner),
    primaryImage: pickPrimaryImage(property.images),
    imageCount,
    videoCount,
    viewCount: property.viewCount,
    favoritesCount: property._count.favorites,
    submittedAt: dateToIso(property.submittedAt),
    publishedAt: dateToIso(property.publishedAt),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

function buildPaymentSummary(payments: Payment[]): AdminPropertyPaymentSummaryDto {
  let successful = 0;
  let pending = 0;
  let failed = 0;
  let totalPaid = 0;

  for (const payment of payments) {
    if (payment.status === PaymentStatus.SUCCESS) {
      successful += 1;
      totalPaid += Number(payment.amount);
    } else if (payment.status === PaymentStatus.PENDING) {
      pending += 1;
    } else if (payment.status === PaymentStatus.FAILED) {
      failed += 1;
    }
  }

  return {
    total: payments.length,
    successful,
    pending,
    failed,
    totalPaid,
  };
}

export function toAdminPropertyReviewDetails(
  property: AdminPropertyDetailsSource,
): AdminPropertyReviewDetailsDto {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    referenceNumber: property.referenceNumber,
    status: property.status,
    price: decimalToNumber(property.price),
    pricePerSqm: computePricePerSqm(property.price, property.areaSqm),
    currency: property.currency,
    paymentType: property.paymentType,
    downPayment: decimalToNumber(property.downPayment),
    installmentYears: property.installmentYears,
    monthlyInstallment: decimalToNumber(property.monthlyInstallment),
    finishingType: property.finishingType,
    rentPeriod: property.rentPeriod,
    furnished: property.furnished,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    floor: property.floor,
    yearBuilt: property.yearBuilt,
    address: property.address,
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
    propertyType: toTypeRef(property.propertyType),
    transactionType: toTypeRef(property.transactionType),
    location: toLocationSummary(property.area, property.district),
    compound: toNamedRef(property.compound),
    developer: toNamedRef(property.compound?.developer ?? null),
    viewCount: property.viewCount,
    favoritesCount: property._count.favorites,
    owner: toOwnerDto(property.owner),
    images: property.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        mediaAssetId: image.mediaAssetId,
        url: image.mediaAsset.url,
        type: image.type,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
      })),
    features: property.features.map(({ feature }) => toFeatureResponse(feature)),
    subscriptions: property.subscriptions.map((subscription) =>
      toSubscriptionResponse(subscription),
    ),
    paymentSummary: buildPaymentSummary(property.payments),
    statusHistory: property.statusHistory.map((entry) => ({
      id: entry.id,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      reason: entry.reason,
      changedById: entry.changedById,
      changedByName: toUserDisplayName(entry.changedBy),
      createdAt: entry.createdAt.toISOString(),
    })),
    submittedAt: dateToIso(property.submittedAt),
    reviewedAt: dateToIso(property.reviewedAt),
    reviewedById: property.reviewedById,
    reviewedByName: toUserDisplayName(property.reviewedBy),
    rejectedReason: property.rejectedReason,
    archivedAt: dateToIso(property.archivedAt),
    publishedAt: dateToIso(property.publishedAt),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

export function toAdminPropertyActionResponse(
  property: Property,
): Pick<
  AdminPropertyReviewCardDto,
  'id' | 'slug' | 'title' | 'status' | 'submittedAt'
> & {
  reviewedAt: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  rejectedReason: string | null;
} {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    status: property.status,
    submittedAt: dateToIso(property.submittedAt),
    reviewedAt: dateToIso(property.reviewedAt),
    publishedAt: dateToIso(property.publishedAt),
    archivedAt: dateToIso(property.archivedAt),
    rejectedReason: property.rejectedReason,
  };
}