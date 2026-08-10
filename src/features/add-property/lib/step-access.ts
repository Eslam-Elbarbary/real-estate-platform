import type { ListingDraft, ListingDraftStep } from '../types';
import { basicStepSchema, detailsStepSchema, descriptionStepSchema, mediaStepSchema, pricingStepSchema } from '../schemas';

const STEP_ORDER: ListingDraftStep[] = [
  'basic',
  'details',
  'price',
  'description',
  'media',
  'publish',
];

export function isBasicComplete(draft: ListingDraft): boolean {
  return basicStepSchema.safeParse({
    transaction: draft.transaction,
    propertyType: draft.propertyType,
    locationId: draft.locationId,
    locationLabel: draft.locationLabel,
    latitude: draft.latitude,
    longitude: draft.longitude,
  }).success;
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

export function canAccessListingStep(
  draft: ListingDraft,
  step: ListingDraftStep,
): boolean {
  const targetIndex = STEP_ORDER.indexOf(step);
  const allowed = earliestIncompleteStep(draft);
  const allowedIndex = STEP_ORDER.indexOf(allowed);
  return targetIndex <= allowedIndex;
}

export function stepHref(id: string, step: ListingDraftStep | 'checkout'): string {
  return `/my-properties/${id}/${step}`;
}
