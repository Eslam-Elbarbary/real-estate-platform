import type { FavoritePropertyDto, FavoriteResponseDto } from '@/types/api/favorites';
import type { CurrencyCode, Property } from '@/types';
import type { FavoriteItem } from '../types';

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

/**
 * Map slim favorite property DTO into the web Property card model.
 * Missing marketplace fields stay empty/zero — never invented.
 */
export function mapFavoritePropertyToProperty(
  dto: FavoritePropertyDto,
): Property {
  const cityName = displayName(dto.location.city);
  const areaName = displayName(dto.location.area);
  const districtName = displayName(dto.location.district);
  const countryName = displayName(dto.location.country);
  const title = dto.title?.trim() || '';
  const now = new Date(0).toISOString();

  const images = dto.primaryImage
    ? [
        {
          id: `${dto.id}-primary`,
          url: dto.primaryImage.url,
          alt: title,
          isCover: dto.primaryImage.isPrimary,
          order: dto.primaryImage.sortOrder,
        },
      ]
    : [];

  return {
    id: dto.id,
    referenceNumber: '',
    slug: dto.slug,
    title,
    description: '',
    transactionType: 'sale',
    propertyType: 'apartment',
    price: dto.price ?? 0,
    pricePerSqm: 0,
    currency: mapCurrency(dto.currency),
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
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
      latitude: 0,
      longitude: 0,
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
    createdAt: now,
    updatedAt: now,
  };
}

export function mapFavoriteResponseToItem(
  dto: FavoriteResponseDto,
): FavoriteItem {
  const createdAt =
    typeof dto.createdAt === 'string'
      ? dto.createdAt
      : new Date(dto.createdAt as unknown as Date).toISOString();

  return {
    id: dto.id,
    propertyId: dto.property.id,
    createdAt,
  };
}
