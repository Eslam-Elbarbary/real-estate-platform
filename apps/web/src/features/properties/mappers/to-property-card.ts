import type {
  ApiFinishingType,
  ApiPaymentType,
  PublicPropertyCardDto,
} from '@/types/api/public-property';
import type {
  FinishingType,
  PaymentType,
  Property,
  PropertyType,
  TransactionType,
} from '@/types';

const PROPERTY_TYPES = new Set<PropertyType>([
  'apartment',
  'villa',
  'townhouse',
  'duplex',
  'penthouse',
  'studio',
  'chalet',
  'office',
  'shop',
  'land',
]);

export function mapTransactionType(
  code: string | undefined | null,
): TransactionType {
  return code?.toUpperCase() === 'RENT' ? 'rent' : 'sale';
}

export function mapPropertyType(code: string | undefined | null): PropertyType {
  const normalized = code?.toLowerCase() as PropertyType | undefined;
  if (normalized && PROPERTY_TYPES.has(normalized)) {
    return normalized;
  }
  return 'apartment';
}

export function mapPaymentType(
  value: ApiPaymentType | null | undefined,
): PaymentType | undefined {
  if (!value) {
    return undefined;
  }
  switch (value) {
    case 'INSTALLMENT':
      return 'installment';
    case 'CASH_OR_INSTALLMENT':
      return 'cash_or_installment';
    case 'CASH':
      return 'cash';
    default:
      return undefined;
  }
}

export function mapFinishingType(
  value: ApiFinishingType | null | undefined,
): FinishingType | undefined {
  if (!value) {
    return undefined;
  }
  switch (value) {
    case 'UNFINISHED':
      return 'unfinished';
    case 'SEMI_FINISHED':
      return 'semi_finished';
    case 'LUX':
      return 'lux';
    case 'SUPER_LUX':
      return 'super_lux';
    case 'FINISHED':
      return 'finished';
    default:
      return undefined;
  }
}

function displayName(ref: { nameAr: string | null; nameEn: string } | null | undefined): string {
  if (!ref) {
    return '';
  }
  return ref.nameAr?.trim() || ref.nameEn;
}

/**
 * Map a public search card DTO into the existing web `Property` view model.
 * Fields unavailable from the API are filled with safe empty defaults
 * (never invented marketplace data).
 */
export function mapPublicCardToProperty(dto: PublicPropertyCardDto): Property {
  const cityName = displayName(dto.location.city);
  const areaName = displayName(dto.location.area);
  const districtName = displayName(dto.location.district);
  const countryName = displayName(dto.location.country);

  const latitude = dto.coordinates.latitude ?? 0;
  const longitude = dto.coordinates.longitude ?? 0;
  const publishedAt = dto.publishedAt ?? new Date(0).toISOString();

  const images = dto.primaryImage
    ? [
        {
          id: `${dto.id}-primary`,
          url: dto.primaryImage.url,
          alt: dto.title ?? '',
          isCover: dto.primaryImage.isPrimary,
          order: dto.primaryImage.sortOrder,
        },
      ]
    : [];

  return {
    id: dto.id,
    referenceNumber: dto.referenceNumber ?? '',
    slug: dto.slug,
    title: dto.title ?? '',
    description: '',
    transactionType: mapTransactionType(dto.transactionType?.code),
    propertyType: mapPropertyType(dto.propertyType?.code),
    price: dto.price ?? 0,
    pricePerSqm: dto.pricePerSqm ?? 0,
    currency: 'EGP',
    area: dto.areaSqm ?? 0,
    bedrooms: dto.bedrooms ?? 0,
    bathrooms: dto.bathrooms ?? 0,
    finishingType: mapFinishingType(dto.finishingType) ?? 'finished',
    paymentType: mapPaymentType(dto.paymentType) ?? 'cash',
    location: {
      countrySlug: dto.location.country?.slug ?? dto.location.country?.id ?? '',
      countryName,
      governorateSlug: dto.location.city?.slug ?? '',
      governorateName: cityName,
      citySlug: dto.location.city?.slug ?? '',
      cityName,
      areaSlug: dto.location.area?.slug ?? '',
      areaName: areaName || dto.location.summary || '',
      neighborhoodSlug: dto.location.district?.slug ?? undefined,
      neighborhoodName: districtName || undefined,
      latitude,
      longitude,
    },
    images,
    seller: {
      id: '',
      name: '',
      type: 'owner',
      phone: '',
      isVerified: false,
    },
    amenities: [],
    features: [],
    verificationState: 'unverified',
    views: 0,
    favoritesCount: 0,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
}

export function toApiPaymentType(
  value: PaymentType | undefined,
): ApiPaymentType | undefined {
  if (!value) {
    return undefined;
  }
  switch (value) {
    case 'installment':
      return 'INSTALLMENT';
    case 'cash_or_installment':
      return 'CASH_OR_INSTALLMENT';
    case 'cash':
      return 'CASH';
    default:
      return undefined;
  }
}

export function toApiFinishingType(
  value: FinishingType | undefined,
): ApiFinishingType | undefined {
  if (!value) {
    return undefined;
  }
  switch (value) {
    case 'unfinished':
      return 'UNFINISHED';
    case 'semi_finished':
      return 'SEMI_FINISHED';
    case 'finished':
      return 'FINISHED';
    case 'lux':
      return 'LUX';
    case 'super_lux':
      return 'SUPER_LUX';
    default:
      return undefined;
  }
}

export function toApiSort(
  sort: string | undefined,
): 'newest' | 'price_asc' | 'price_desc' {
  if (sort === 'price_asc' || sort === 'price_desc') {
    return sort;
  }
  // recommended / area_* / newest → newest
  return 'newest';
}
