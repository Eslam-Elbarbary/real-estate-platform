import type { ListingDraft, ListingDraftStep } from '../types';
import {
  basicStepSchema,
  detailsStepSchema,
  descriptionStepSchema,
  mediaStepSchema,
  pricingStepSchema,
} from '../schemas';
import type { ApiPropertyStatus } from '@/types/api/my-property';

const STEP_ORDER: ListingDraftStep[] = [
  'basic',
  'details',
  'price',
  'description',
  'media',
  'publish',
];

export function isPropertyEditable(status: ApiPropertyStatus): boolean {
  return status === 'DRAFT' || status === 'REJECTED';
}

export function isBasicComplete(draft: ListingDraft): boolean {
  return Boolean(
    draft.transaction &&
      draft.propertyType &&
      draft.areaId &&
      draft.locationId &&
      draft.locationLabel &&
      draft.latitude != null &&
      draft.longitude != null &&
      Number.isFinite(draft.latitude) &&
      Number.isFinite(draft.longitude),
  );
}

export function isDetailsComplete(draft: ListingDraft): boolean {
  return detailsStepSchema.safeParse(draft.details).success;
}

export function isPriceComplete(draft: ListingDraft): boolean {
  if (!draft.pricing || draft.pricing.mode == null) return false;
  return pricingStepSchema.safeParse(draft.pricing).success;
}

export function isDescriptionComplete(draft: ListingDraft): boolean {
  return descriptionStepSchema.safeParse(draft.description).success;
}

export function isMediaComplete(draft: ListingDraft): boolean {
  return mediaStepSchema.safeParse(draft.media).success;
}

export function earliestIncompleteStep(draft: ListingDraft): ListingDraftStep {
  if (!isBasicComplete(draft)) return 'basic';
  if (!isDetailsComplete(draft)) return 'details';
  if (!isPriceComplete(draft)) return 'price';
  if (!isDescriptionComplete(draft)) return 'description';
  if (!isMediaComplete(draft)) return 'media';
  return 'publish';
}

/**
 * Wizard navigation rules driven by API status + field completeness.
 */
export function canAccessListingStep(
  draft: ListingDraft,
  step: ListingDraftStep,
): boolean {
  const status = draft.apiStatus;

  if (status === 'PENDING_PAYMENT') {
    return step === 'publish';
  }

  if (
    status === 'PENDING_REVIEW' ||
    status === 'PUBLISHED' ||
    status === 'ARCHIVED' ||
    status === 'EXPIRED'
  ) {
    return step === 'publish';
  }

  // DRAFT | REJECTED — sequential wizard
  const targetIndex = STEP_ORDER.indexOf(step);
  const allowed = earliestIncompleteStep(draft);
  const allowedIndex = STEP_ORDER.indexOf(allowed);
  return targetIndex <= allowedIndex;
}

export function resolveCheckoutAccess(draft: ListingDraft): boolean {
  return draft.apiStatus === 'PENDING_PAYMENT';
}

export function stepHref(id: string, step: ListingDraftStep | 'checkout'): string {
  return `/my-properties/${id}/${step}`;
}

export function preferredStepForStatus(draft: ListingDraft): ListingDraftStep | 'checkout' {
  switch (draft.apiStatus) {
    case 'PENDING_PAYMENT':
      return 'checkout';
    case 'PENDING_REVIEW':
    case 'PUBLISHED':
    case 'ARCHIVED':
    case 'EXPIRED':
      return 'publish';
    case 'REJECTED':
    case 'DRAFT':
    default:
      return earliestIncompleteStep(draft);
  }
}
