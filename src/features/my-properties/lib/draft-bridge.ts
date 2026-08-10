import { getPropertyTypeLabel } from '@/config/property-types';
import type { ListingDraft } from '@/features/add-property/types';
import { resolveListingDisplayPrice } from '@/features/add-property/lib/pricing';
import type { ManagedListing } from '../types';

export function listingDraftToManagedListing(draft: ListingDraft): ManagedListing {
  const cover =
    draft.media.images.find((img) => img.isCover) ?? draft.media.images[0];
  return {
    id: draft.id,
    slug: `draft-${draft.id.toLowerCase()}`,
    title:
      draft.description.ar.title ||
      (draft.propertyType
        ? `مسودة — ${getPropertyTypeLabel(draft.propertyType)}`
        : 'مسودة إعلان'),
    image: cover?.previewUrl,
    transaction: draft.transaction ?? 'sale',
    propertyType: draft.propertyType ?? 'apartment',
    locationLabel: draft.locationLabel ?? 'لم يُحدد الموقع بعد',
    priceEgp: resolveListingDisplayPrice(draft),
    status: 'draft',
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
    draftStep: draft.currentStep === 'publish' ? 'publish' : draft.currentStep,
  };
}
