import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Area,
  City,
  Compound,
  Country,
  District,
  Feature,
  FinishingType,
  MediaAsset,
  Payment,
  PaymentStatus,
  PaymentType,
  Plan,
  Property,
  PropertyImage,
  PropertyStatus,
  PropertyStatusHistory,
  PropertyType,
  Subscription,
  TransactionType,
  User,
} from '@prisma/client';
import { FeatureResponseDto, toFeatureResponse } from '../../properties/mapper/feature.mapper';
import {
  PublicLocationRefDto,
  PublicLocationSummaryDto,
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
  price!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ enum: PropertyStatus })
  status!: PropertyStatus;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  propertyType!: PublicTypeRefDto | null;

  @ApiPropertyOptional({ type: PublicTypeRefDto, nullable: true })
  transactionType!: PublicTypeRefDto | null;

  @ApiProperty({ type: PublicLocationSummaryDto })
  location!: PublicLocationSummaryDto;

  @ApiProperty({ type: AdminPropertyOwnerDto })
  owner!: AdminPropertyOwnerDto;

  @ApiPropertyOptional({ nullable: true })
  submittedAt!: string | null;

  @ApiProperty()
  createdAt!: string;
}

export class AdminPropertyImageDto {
  @ApiProperty()
  url!: string;

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
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'avatarUrl'>;
};

export type AdminPropertyDetailsSource = AdminPropertyCardSource & {
  compound: Compound | null;
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

export function toAdminPropertyReviewCard(
  property: AdminPropertyCardSource,
): AdminPropertyReviewCardDto {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    price: decimalToNumber(property.price),
    currency: property.currency,
    status: property.status,
    propertyType: toTypeRef(property.propertyType),
    transactionType: toTypeRef(property.transactionType),
    location: toLocationSummary(property.area, property.district),
    owner: toOwnerDto(property.owner),
    submittedAt: dateToIso(property.submittedAt),
    createdAt: property.createdAt.toISOString(),
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
    currency: property.currency,
    paymentType: property.paymentType,
    downPayment: decimalToNumber(property.downPayment),
    installmentYears: property.installmentYears,
    monthlyInstallment: decimalToNumber(property.monthlyInstallment),
    finishingType: property.finishingType,
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
    owner: toOwnerDto(property.owner),
    images: property.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        url: image.mediaAsset.url,
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