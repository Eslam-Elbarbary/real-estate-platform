import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Feature,
  FinishingType,
  PaymentType,
  Property,
  PropertyStatus,
  RentPeriod,
} from '@/prisma/generated/prisma-client';
import { FeatureResponseDto, toFeatureResponse } from './feature.mapper';

export class PropertyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: PropertyStatus })
  status!: PropertyStatus;

  @ApiPropertyOptional({ nullable: true })
  propertyTypeId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  transactionTypeId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  areaId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  districtId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  compoundId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  legalStatusId!: string | null;

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

  @ApiPropertyOptional({ enum: FinishingType, nullable: true })
  finishingType!: FinishingType | null;

  @ApiPropertyOptional({ enum: RentPeriod, nullable: true })
  rentPeriod!: RentPeriod | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ enum: PaymentType, nullable: true })
  paymentType!: PaymentType | null;

  @ApiPropertyOptional({ nullable: true })
  downPayment!: number | null;

  @ApiPropertyOptional({ nullable: true })
  installmentYears!: number | null;

  @ApiPropertyOptional({ nullable: true })
  monthlyInstallment!: number | null;

  @ApiPropertyOptional({ type: [FeatureResponseDto] })
  features?: FeatureResponseDto[];

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  submittedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  archivedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Rejection reason visible to the property owner only',
  })
  rejectedReason!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Primary image URL when available',
  })
  primaryImageUrl!: string | null;

  @ApiPropertyOptional({ type: () => OwnerLocationSummaryDto, nullable: true })
  location?: OwnerLocationSummaryDto | null;

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  compound?: OwnerNamedRefDto | null;

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, isArray: true })
  propertyViews?: OwnerNamedRefDto[];

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  legalStatus?: OwnerNamedRefDto | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class OwnerNamedRefDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  slug?: string | null;

  @ApiPropertyOptional({ nullable: true })
  code?: string | null;
}

export class OwnerLocationSummaryDto {
  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  country!: OwnerNamedRefDto | null;

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  city!: OwnerNamedRefDto | null;

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  area!: OwnerNamedRefDto | null;

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  district!: OwnerNamedRefDto | null;

  @ApiPropertyOptional({ type: () => OwnerNamedRefDto, nullable: true })
  compound!: OwnerNamedRefDto | null;

  @ApiProperty()
  summary!: string;
}

export class OwnerPropertyStatusHistoryDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ enum: PropertyStatus, nullable: true })
  fromStatus!: PropertyStatus | null;

  @ApiProperty({ enum: PropertyStatus })
  toStatus!: PropertyStatus;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Owner-safe note (e.g. rejection reason). No admin identity.',
  })
  reason!: string | null;

  @ApiProperty()
  createdAt!: string;
}

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
  value:
    | {
        id: string;
        nameEn: string;
        nameAr: string | null;
        slug?: string | null;
        code?: string | null;
      }
    | null
    | undefined,
): OwnerNamedRefDto | null {
  if (!value) return null;
  return {
    id: value.id,
    nameEn: value.nameEn,
    nameAr: value.nameAr,
    ...(value.slug !== undefined ? { slug: value.slug } : {}),
    ...(value.code !== undefined ? { code: value.code } : {}),
  };
}

type LocationInclude = {
  area?: {
    id: string;
    nameEn: string;
    nameAr: string | null;
    slug: string;
    city: {
      id: string;
      nameEn: string;
      nameAr: string | null;
      slug: string;
      country: {
        id: string;
        nameEn: string;
        nameAr: string | null;
        code: string;
      };
    };
  } | null;
  district?: {
    id: string;
    nameEn: string;
    nameAr: string | null;
    slug: string;
  } | null;
  compound?: {
    id: string;
    nameEn: string;
    nameAr: string | null;
    slug: string;
  } | null;
  viewAssignments?: Array<{
    view: {
      id: string;
      code: string;
      nameEn: string;
      nameAr: string | null;
    };
  }>;
  legalStatus?: {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string | null;
  } | null;
};

function toOwnerLocationSummary(
  property: LocationInclude,
): OwnerLocationSummaryDto | null {
  if (!property.area && !property.district && !property.compound) {
    return null;
  }
  const country = property.area?.city.country ?? null;
  const city = property.area?.city ?? null;
  const area = property.area ?? null;
  const district = property.district ?? null;
  const compound = property.compound ?? null;
  const parts = [
    compound?.nameAr || compound?.nameEn,
    district?.nameAr || district?.nameEn,
    area?.nameAr || area?.nameEn,
    city?.nameAr || city?.nameEn,
    country?.nameAr || country?.nameEn,
  ].filter(Boolean);

  return {
    country: toNamedRef(country),
    city: toNamedRef(city),
    area: toNamedRef(area),
    district: toNamedRef(district),
    compound: toNamedRef(compound),
    summary: parts.join(' · '),
  };
}

export function toPropertyResponse(
  property: Property & LocationInclude,
  features?: Feature[],
  extras?: {
    primaryImageUrl?: string | null;
  },
): PropertyResponseDto {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    slug: property.slug,
    status: property.status,
    propertyTypeId: property.propertyTypeId,
    transactionTypeId: property.transactionTypeId,
    areaId: property.areaId,
    districtId: property.districtId,
    compoundId: property.compoundId,
    legalStatusId: property.legalStatusId,
    address: property.address,
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    floor: property.floor,
    yearBuilt: property.yearBuilt,
    furnished: property.furnished,
    finishingType: property.finishingType,
    rentPeriod: property.rentPeriod,
    price: decimalToNumber(property.price),
    currency: property.currency,
    paymentType: property.paymentType,
    downPayment: decimalToNumber(property.downPayment),
    installmentYears: property.installmentYears,
    monthlyInstallment: decimalToNumber(property.monthlyInstallment),
    ...(features
      ? { features: features.map(toFeatureResponse) }
      : {}),
    publishedAt: dateToIso(property.publishedAt),
    submittedAt: dateToIso(property.submittedAt),
    archivedAt: dateToIso(property.archivedAt),
    rejectedReason: property.rejectedReason,
    primaryImageUrl: extras?.primaryImageUrl ?? null,
    location: toOwnerLocationSummary(property),
    compound: toNamedRef(property.compound),
    ...(property.viewAssignments
      ? {
          propertyViews: property.viewAssignments
            .map(({ view }) => toNamedRef(view))
            .filter((view): view is OwnerNamedRefDto => view !== null)
            .sort((a, b) => a.nameEn.localeCompare(b.nameEn)),
        }
      : {}),
    legalStatus: toNamedRef(property.legalStatus),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

export function toOwnerStatusHistoryResponse(entry: {
  id: string;
  fromStatus: PropertyStatus | null;
  toStatus: PropertyStatus;
  reason: string | null;
  createdAt: Date;
}): OwnerPropertyStatusHistoryDto {
  // Only surface reason on rejection transitions (owner-facing).
  const reason =
    entry.toStatus === PropertyStatus.REJECTED ? entry.reason : null;

  return {
    id: entry.id,
    fromStatus: entry.fromStatus,
    toStatus: entry.toStatus,
    reason,
    createdAt: entry.createdAt.toISOString(),
  };
}
