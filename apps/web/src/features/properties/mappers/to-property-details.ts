import type {
  ApiRentPeriod,
  PublicPropertyDetailsDto,
  PublicPropertyFeatureDto,
  PublicPropertyMediaDto,
} from '@/types/api/public-property';
import type {
  CurrencyCode,
  PricingPeriod,
  Property,
  PropertyImage,
} from '@/types';
import {
  mapFinishingType,
  mapPaymentType,
  mapPropertyType,
  mapTransactionType,
  mapPublicCardToProperty,
} from './to-property-card';

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function displayName(
  ref: { nameAr: string | null; nameEn: string } | null | undefined,
): string {
  if (!ref) {
    return '';
  }
  return ref.nameAr?.trim() || ref.nameEn;
}

function mapCurrency(value: string): CurrencyCode {
  return value === 'EGP' ? 'EGP' : 'EGP';
}

function mapPricingPeriod(
  transactionType: Property['transactionType'],
  rentPeriod: ApiRentPeriod | null,
): PricingPeriod | undefined {
  if (transactionType !== 'rent') {
    return 'one_time';
  }
  switch (rentPeriod) {
    case 'DAILY':
      return 'daily';
    case 'YEARLY':
      return 'yearly';
    case 'MONTHLY':
      return 'monthly';
    default:
      return 'monthly';
  }
}

function featureLabel(feature: PublicPropertyFeatureDto): string {
  return feature.nameAr?.trim() || feature.nameEn;
}

function mapImages(
  media: PublicPropertyMediaDto[],
  title: string,
): PropertyImage[] {
  return [...media]
    .filter((item) => item.type === 'IMAGE' && Boolean(item.url))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      id: item.id,
      url: item.url,
      alt: title,
      isCover: item.isPrimary,
      order: item.sortOrder,
      width: item.width ?? undefined,
      height: item.height ?? undefined,
    }));
}

export interface MappedPropertyDetails {
  property: Property;
  similar: Property[];
}

/**
 * Map public property details DTO → web Property view model.
 * Does not invent marketplace values for missing optional fields.
 */
export function mapPublicDetailsToProperty(
  dto: PublicPropertyDetailsDto,
): MappedPropertyDetails {
  const title = dto.title?.trim() || '';
  const cityName = displayName(dto.city);
  const areaName = displayName(dto.area);
  const districtName = displayName(dto.district);
  const countryName = displayName(dto.country);
  const compoundName = displayName(dto.compound) || undefined;
  const developerName = displayName(dto.developer) || undefined;

  const latitude = toNumber(dto.latitude);
  const longitude = toNumber(dto.longitude);
  const price = toNumber(dto.price);
  const pricePerSqm = toNumber(dto.pricePerSqm);
  const area = toNumber(dto.areaSqm);
  const downPayment = toNumber(dto.payment.downPayment);
  const monthlyInstallment = toNumber(dto.payment.monthlyInstallment);
  const publishedAt = dto.publishedAt ?? new Date(0).toISOString();

  const transactionType = mapTransactionType(dto.transactionType?.code);
  const finishingType = mapFinishingType(dto.finishingType);
  const paymentType = mapPaymentType(dto.payment.type);
  const featureLabels = dto.features.map(featureLabel).filter(Boolean);

  const property: Property = {
    id: dto.id,
    referenceNumber: dto.referenceNumber?.trim() || '',
    slug: dto.slug,
    title,
    description: dto.description?.trim() || '',
    transactionType,
    propertyType: mapPropertyType(dto.propertyType?.code),
    price: price ?? 0,
    pricePerSqm: pricePerSqm ?? 0,
    currency: mapCurrency(dto.currency),
    pricingPeriod: mapPricingPeriod(transactionType, dto.rentPeriod),
    area: area ?? 0,
    bedrooms: dto.bedrooms ?? 0,
    bathrooms: dto.bathrooms ?? 0,
    ...(dto.floor !== null && dto.floor !== undefined
      ? { floor: dto.floor }
      : {}),
    ...(finishingType ? { finishingType } : {}),
    ...(paymentType ? { paymentType } : {}),
    ...(downPayment !== null ? { downPayment } : {}),
    ...(dto.payment.installmentYears !== null &&
    dto.payment.installmentYears !== undefined
      ? { installmentYears: dto.payment.installmentYears }
      : {}),
    ...(monthlyInstallment !== null ? { monthlyInstallment } : {}),
    ...(dto.yearBuilt !== null && dto.yearBuilt !== undefined
      ? { yearBuilt: dto.yearBuilt }
      : {}),
    ...(dto.furnished !== null && dto.furnished !== undefined
      ? { furnished: dto.furnished }
      : {}),
    location: {
      countrySlug: dto.country?.slug ?? dto.country?.id ?? '',
      countryName,
      governorateSlug: dto.city?.slug ?? '',
      governorateName: cityName,
      citySlug: dto.city?.slug ?? '',
      cityName,
      areaSlug: dto.area?.slug ?? '',
      areaName: areaName || countryName,
      neighborhoodSlug: dto.district?.slug ?? undefined,
      neighborhoodName: districtName || undefined,
      addressLine: dto.address?.trim() || undefined,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    },
    ...(dto.compound
      ? {
          compoundId: dto.compound.id,
          compoundSlug: dto.compound.slug ?? undefined,
          compoundName,
        }
      : {}),
    ...(dto.developer
      ? {
          developerId: dto.developer.id,
          developerName,
        }
      : {}),
    images: mapImages(dto.images, title),
    seller: {
      id: dto.owner.id,
      name: dto.owner.name?.trim() || '',
      type: 'owner',
      phone: '',
      avatarUrl: dto.owner.avatarUrl ?? undefined,
      isVerified: false,
    },
    amenities: featureLabels,
    features: featureLabels,
    verificationState: 'unverified',
    views: dto.viewCount ?? 0,
    favoritesCount: dto.favoritesCount ?? 0,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };

  return {
    property,
    similar: dto.similar.map(mapPublicCardToProperty),
  };
}
