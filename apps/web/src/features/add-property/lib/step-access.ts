import type { ListingDraft, ListingDraftStep } from '../types';
import {
  contactStepSchema,
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
  'contact',
  'media',
  'preview',
  'publish',
];

/** Content wizard is only for unfinished or rejected listings. */
export function isPropertyEditable(status: ApiPropertyStatus): boolean {
  return status === 'DRAFT' || status === 'REJECTED';
}

/** Only DRAFT may be resumed from /add-property. */
export function canResumeFromAddProperty(status: ApiPropertyStatus): boolean {
  return status === 'DRAFT';
}

export function isBasicComplete(draft: ListingDraft): boolean {
  return Boolean(
    draft.transaction &&
      draft.propertyType &&
      draft.countryId &&
      draft.cityId &&
      draft.areaId,
  );
}

export function isDetailsComplete(draft: ListingDraft): boolean {
  return detailsStepSchema.safeParse(draft.details).success;
}

export function isPriceComplete(draft: ListingDraft): boolean {
  return pricingStepSchema.safeParse({
    ...draft.pricing,
    transaction: draft.transaction ?? undefined,
  }).success;
}

export function isDescriptionComplete(draft: ListingDraft): boolean {
  return descriptionStepSchema.safeParse(draft.description).success;
}

export function isContactComplete(draft: ListingDraft): boolean {
  return contactStepSchema.safeParse(draft.contact).success;
}

export function isMediaComplete(draft: ListingDraft): boolean {
  return mediaStepSchema.safeParse(draft.media).success;
}

export function earliestIncompleteStep(draft: ListingDraft): ListingDraftStep {
  if (!isBasicComplete(draft)) return 'basic';
  if (!isDetailsComplete(draft)) return 'details';
  if (!isPriceComplete(draft)) return 'price';
  if (!isDescriptionComplete(draft)) return 'description';
  if (!isContactComplete(draft)) return 'contact';
  if (!isMediaComplete(draft)) return 'media';
  // Preview is available once media is done; publish is the terminal content step.
  return 'publish';
}

/**
 * First incomplete content step for validation before submit.
 * Returns null when all wizard content steps (through media) are valid.
 */
export function earliestIncompleteWizardStep(
  draft: ListingDraft,
): ListingDraftStep | null {
  if (!isBasicComplete(draft)) return 'basic';
  if (!isDetailsComplete(draft)) return 'details';
  if (!isPriceComplete(draft)) return 'price';
  if (!isDescriptionComplete(draft)) return 'description';
  if (!isContactComplete(draft)) return 'contact';
  if (!isMediaComplete(draft)) return 'media';
  return null;
}

/**
 * Wizard navigation rules driven by API status + field completeness.
 * Submitted / published listings never access the wizard.
 */
export function canAccessListingStep(
  draft: ListingDraft,
  step: ListingDraftStep,
): boolean {
  const status = draft.apiStatus;

  // Payment only — checkout route is separate; publish may show pay CTA.
  if (status === 'PENDING_PAYMENT') {
    return step === 'publish';
  }

  if (!isPropertyEditable(status)) {
    return false;
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

export function listingDetailHref(id: string): string {
  return `/my-properties/${id}`;
}

/**
 * Where to send the user for a property based on API status.
 * Non-editable statuses go to the detail/status page — never the wizard.
 */
export function preferredDestinationForStatus(draft: ListingDraft): string {
  switch (draft.apiStatus) {
    case 'PENDING_PAYMENT':
      return stepHref(draft.id, 'checkout');
    case 'PENDING_REVIEW':
    case 'PUBLISHED':
    case 'ARCHIVED':
    case 'EXPIRED':
      return listingDetailHref(draft.id);
    case 'REJECTED':
    case 'DRAFT':
    default:
      return stepHref(draft.id, earliestIncompleteStep(draft));
  }
}

/** @deprecated Prefer preferredDestinationForStatus */
export function preferredStepForStatus(
  draft: ListingDraft,
): ListingDraftStep | 'checkout' | 'detail' {
  switch (draft.apiStatus) {
    case 'PENDING_PAYMENT':
      return 'checkout';
    case 'PENDING_REVIEW':
    case 'PUBLISHED':
    case 'ARCHIVED':
    case 'EXPIRED':
      return 'detail';
    case 'REJECTED':
    case 'DRAFT':
    default:
      return earliestIncompleteStep(draft);
  }
}
