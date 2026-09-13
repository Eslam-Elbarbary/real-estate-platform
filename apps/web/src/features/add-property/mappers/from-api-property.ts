import type { CatalogTypeDto } from '@/types/api/public-property';
import type { MyPropertyDto, PropertyImageDto } from '@/types/api/my-property';
import type { PropertyType, TransactionType } from '@/types';
import type { LocationOption } from '@/features/locations';
import type {
  ListingDraft,
  ListingImageDraft,
  ListingPricingDraft,
} from '../types';

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

function emptyDescription() {
  return {
    ar: { title: '', description: '', address: '' },
    en: { title: '', description: '', address: '' },
  };
}

export function resolvePropertyTypeCode(
  propertyTypeId: string | null,
  propertyTypes: CatalogTypeDto[],
): PropertyType | null {
  if (!propertyTypeId) return null;
  const match = propertyTypes.find((item) => item.id === propertyTypeId);
  if (!match) return null;
  const code = match.code.toLowerCase() as PropertyType;
  return PROPERTY_TYPES.has(code) ? code : null;
}

export function resolveTransactionCode(
  transactionTypeId: string | null,
  transactionTypes: CatalogTypeDto[],
): TransactionType | null {
  if (!transactionTypeId) return null;
  const match = transactionTypes.find((item) => item.id === transactionTypeId);
  if (!match) return null;
  return match.code.toUpperCase() === 'RENT' ? 'rent' : 'sale';
}

export function resolveCatalogIdByCode(
  items: CatalogTypeDto[],
  code: string,
): string | undefined {
  const normalized = code.trim().toUpperCase();
  return items.find((item) => item.code.toUpperCase() === normalized)?.id;
}

function resolveLocationFromProperty(
  dto: MyPropertyDto,
  locations: LocationOption[],
): { locationId?: string; locationLabel?: string } {
  if (dto.districtId) {
    const district = locations.find(
      (item) => item.districtId === dto.districtId || item.id === dto.districtId,
    );
    if (district) {
      return {
        locationId: district.id,
        locationLabel: district.breadcrumb || district.name,
      };
    }
  }
  if (dto.areaId) {
    const area = locations.find(
      (item) => item.areaId === dto.areaId || item.id === dto.areaId,
    );
    if (area) {
      return {
        locationId: area.id,
        locationLabel: area.breadcrumb || area.name,
      };
    }
  }
  if (dto.address?.trim()) {
    return { locationLabel: dto.address.trim() };
  }
  return {};
}

export function mapPropertyImagesToMedia(
  images: PropertyImageDto[],
): ListingImageDraft[] {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted.map((image, index) => ({
    id: image.id,
    url: image.url,
    name: image.publicId || `image-${index + 1}`,
    size: 0,
    order: image.sortOrder,
    isCover: image.isPrimary,
  }));
}

function mapPricingFromApi(
  dto: MyPropertyDto,
  transaction: TransactionType | null,
): ListingPricingDraft {
  if (dto.price == null || !Number.isFinite(dto.price)) {
    return { mode: null };
  }
  if (transaction === 'rent') {
    return {
      mode: 'rent',
      price: dto.price,
      pricingPeriod: 'monthly',
    };
  }
  return {
    mode: 'owner_cash',
    price: dto.price,
  };
}

/**
 * Map API property DTO → wizard ListingDraft view model.
 * Features are not returned by GET /me/:id — amenities stay empty on resume.
 */
export function mapMyPropertyToListingDraft(
  dto: MyPropertyDto,
  catalogs: {
    propertyTypes: CatalogTypeDto[];
    transactionTypes: CatalogTypeDto[];
  },
  locations: LocationOption[],
  ownerUserId: string,
  mediaImages: PropertyImageDto[] = [],
): ListingDraft {
  const location = resolveLocationFromProperty(dto, locations);
  const propertyType = resolvePropertyTypeCode(
    dto.propertyTypeId,
    catalogs.propertyTypes,
  );
  const transaction = resolveTransactionCode(
    dto.transactionTypeId,
    catalogs.transactionTypes,
  );

  const description = emptyDescription();
  if (dto.title?.trim()) {
    description.ar.title = dto.title.trim();
  }
  if (dto.description?.trim()) {
    description.ar.description = dto.description.trim();
  }
  if (dto.address?.trim()) {
    description.ar.address = dto.address.trim();
  }

  const featureIds =
    dto.features?.map((feature) => feature.id).filter(Boolean) ?? [];

  return {
    id: dto.id,
    ownerUserId,
    apiStatus: dto.status,
    transaction,
    propertyType,
    propertyTypeId: dto.propertyTypeId ?? undefined,
    transactionTypeId: dto.transactionTypeId ?? undefined,
    areaId: dto.areaId ?? undefined,
    districtId: dto.districtId ?? undefined,
    locationId: location.locationId,
    locationLabel: location.locationLabel,
    latitude: dto.latitude ?? undefined,
    longitude: dto.longitude ?? undefined,
    details: {
      areaSqm: dto.areaSqm ?? undefined,
      bedrooms: dto.bedrooms ?? undefined,
      bathrooms: dto.bathrooms ?? undefined,
      floor: dto.floor ?? undefined,
      buildOrDeliveryYear: dto.yearBuilt ?? undefined,
      furnished: dto.furnished ?? undefined,
      rentPeriod: dto.rentPeriod ?? undefined,
      views: [],
      amenities: featureIds,
    },
    pricing: mapPricingFromApi(dto, transaction),
    description,
    media: { images: mapPropertyImagesToMedia(mediaImages) },
    currentStep: 'basic',
    status: mapLegacyDraftStatus(dto.status),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

function mapLegacyDraftStatus(
  status: MyPropertyDto['status'],
): ListingDraft['status'] {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'payment_pending';
    case 'PUBLISHED':
      return 'published';
    case 'PENDING_REVIEW':
      return 'ready_to_publish';
    default:
      return 'draft';
  }
}
