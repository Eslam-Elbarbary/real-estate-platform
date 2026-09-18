import type { CatalogTypeDto } from '@/types/api/public-property';
import type { MyPropertyDto, PropertyImageDto } from '@/types/api/my-property';
import type { PropertyType, TransactionType } from '@/types';
import type { LocationOption } from '@/features/locations';
import { mapFinishingType } from '@/features/properties/mappers/to-property-card';
import type {
  ListingContactDraft,
  ListingDraft,
  ListingImageDraft,
  ListingPricingDraft,
} from '../types';
import { emptyPricingDraft } from '../types';

function emptyDescription() {
  return {
    ar: { title: '', description: '', address: '' },
    en: { title: '', description: '', address: '' },
  };
}

export function emptyContactDraft(): ListingContactDraft {
  return {
    contactSource: 'OWNER',
    contactType: 'OWNER',
    contactName: '',
    phone: '',
    whatsapp: '',
    email: '',
  };
}

export function mapContactDtoToDraft(dto: {
  source: 'OWNER' | 'CUSTOM';
  contactType: 'OWNER' | 'AGENT' | 'COMPANY';
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}): ListingContactDraft {
  if (dto.source === 'CUSTOM') {
    return {
      contactSource: 'CUSTOM',
      contactType: dto.contactType,
      contactName: dto.name?.trim() || '',
      phone: dto.phone?.trim() || '',
      whatsapp: dto.whatsapp?.trim() || '',
      email: dto.email?.trim() || '',
    };
  }
  return {
    contactSource: 'OWNER',
    contactType: 'OWNER',
    contactName: dto.name?.trim() || '',
    phone: dto.phone?.trim() || '',
    whatsapp: dto.whatsapp?.trim() || dto.phone?.trim() || '',
    email: dto.email?.trim() || '',
  };
}

export function resolvePropertyTypeCode(
  propertyTypeId: string | null,
  propertyTypes: CatalogTypeDto[],
): PropertyType | null {
  if (!propertyTypeId) return null;
  const match = propertyTypes.find((item) => item.id === propertyTypeId);
  if (!match) return null;
  return match.code.toLowerCase();
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
): {
  locationId?: string;
  locationLabel?: string;
  countryId?: string;
  cityId?: string;
} {
  const countryId = dto.location?.country?.id;
  const cityId = dto.location?.city?.id;
  const summary = dto.location?.summary?.trim();

  if (dto.districtId) {
    const district = locations.find(
      (item) => item.districtId === dto.districtId || item.id === dto.districtId,
    );
    if (district) {
      return {
        locationId: district.id,
        locationLabel: summary || district.breadcrumb || district.name,
        countryId,
        cityId,
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
        locationLabel: summary || area.breadcrumb || area.name,
        countryId,
        cityId,
      };
    }
  }
  if (summary) {
    return { locationLabel: summary, countryId, cityId };
  }
  if (dto.address?.trim()) {
    return { locationLabel: dto.address.trim(), countryId, cityId };
  }
  return { countryId, cityId };
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
  const base = emptyPricingDraft();
  if (dto.price == null || !Number.isFinite(dto.price)) {
    return {
      ...base,
      currency: dto.currency?.trim() || 'EGP',
    };
  }

  if (transaction === 'rent') {
    return {
      ...base,
      price: dto.price,
      currency: dto.currency?.trim() || 'EGP',
      rentPeriod: dto.rentPeriod ?? 'MONTHLY',
      paymentType: '',
    };
  }

  return {
    ...base,
    price: dto.price,
    currency: dto.currency?.trim() || 'EGP',
    paymentType: dto.paymentType ?? '',
    downPayment: dto.downPayment ?? undefined,
    installmentYears: dto.installmentYears ?? undefined,
    monthlyInstallment: dto.monthlyInstallment ?? undefined,
    rentPeriod: '',
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
    compoundId: dto.compoundId ?? undefined,
    countryId: location.countryId,
    cityId: location.cityId,
    address: dto.address?.trim() || undefined,
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
      finishing: mapFinishingType(dto.finishingType),
      rentPeriod: dto.rentPeriod ?? undefined,
      propertyViewIds: dto.propertyViews?.map((view) => view.id) ?? undefined,
      legalStatusId: dto.legalStatusId ?? dto.legalStatus?.id ?? undefined,
      amenities: featureIds,
    },
    pricing: mapPricingFromApi(dto, transaction),
    description,
    contact: emptyContactDraft(),
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
