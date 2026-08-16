import { getPropertyManagementService } from '@/features/my-properties/service';
import type { ManagedListing } from '@/features/my-properties/types';
import { getPropertyTypeLabel } from '@/config/property-types';
import {
  getListingDraftRepository,
  nextStepAfter,
} from './repository';
import { getListingPublicationFee, resolveListingDisplayPrice } from './lib/pricing';
import {
  canAccessListingStep,
  earliestIncompleteStep,
} from './lib/step-access';
import type {
  ListingDescriptionDraft,
  ListingDetailsDraft,
  ListingDraft,
  ListingDraftStep,
  ListingMediaDraft,
  ListingPricingDraft,
  ListingPublicationFee,
} from './types';

export class ListingDraftService {
  constructor(private readonly repository = getListingDraftRepository()) {}

  createDraft(userId: string): Promise<ListingDraft> {
    return this.repository.createDraft(userId);
  }

  getById(id: string): Promise<ListingDraft | null> {
    return this.repository.getById(id);
  }

  getDraft(id: string): Promise<ListingDraft | null> {
    return this.repository.getById(id);
  }

  getIncompleteDraft(userId: string): Promise<ListingDraft | null> {
    return this.repository.getIncompleteDraft(userId);
  }

  async startOrResumeDraft(userId: string): Promise<ListingDraft> {
    const existing = await this.repository.getIncompleteDraft(userId);
    const draft = existing ?? (await this.repository.createDraft(userId));
    const stored = await this.repository.getById(draft.id);
    if (!stored) {
      throw new Error('LISTING_DRAFT_PERSISTENCE_FAILED');
    }
    return stored;
  }

  listDrafts(userId: string): Promise<ListingDraft[]> {
    return this.repository.listByUser(userId);
  }

  deleteDraft(id: string): Promise<void> {
    return this.repository.deleteDraft(id);
  }

  async updateBasic(
    id: string,
    input: {
      transaction: ListingDraft['transaction'];
      propertyType: ListingDraft['propertyType'];
      locationId: string;
      locationLabel: string;
      latitude: number;
      longitude: number;
    },
  ): Promise<ListingDraft> {
    const draft = await this.requireDraft(id);
    return this.repository.saveDraft({
      ...draft,
      ...input,
      currentStep: 'details',
    });
  }

  async updateDetails(id: string, details: ListingDetailsDraft): Promise<ListingDraft> {
    const draft = await this.requireDraft(id);
    return this.repository.saveDraft({
      ...draft,
      details,
      currentStep: 'price',
    });
  }

  async updatePricing(id: string, pricing: ListingPricingDraft): Promise<ListingDraft> {
    const draft = await this.requireDraft(id);
    return this.repository.saveDraft({
      ...draft,
      pricing,
      currentStep: 'description',
    });
  }

  async updateDescription(
    id: string,
    description: ListingDescriptionDraft,
  ): Promise<ListingDraft> {
    const draft = await this.requireDraft(id);
    return this.repository.saveDraft({
      ...draft,
      description,
      currentStep: 'media',
    });
  }

  async updateMedia(id: string, media: ListingMediaDraft): Promise<ListingDraft> {
    const draft = await this.requireDraft(id);
    return this.repository.saveDraft({
      ...draft,
      media,
      currentStep: 'publish',
      status: 'ready_to_publish',
    });
  }

  async prepareForPublish(id: string): Promise<{
    draft: ListingDraft;
    fee: ListingPublicationFee;
  }> {
    const draft = await this.requireDraft(id);
    const fee = getListingPublicationFee({
      transaction: draft.transaction,
      propertyType: draft.propertyType,
      locationId: draft.locationId,
    });
    const next = await this.repository.saveDraft({
      ...draft,
      status: 'payment_pending',
      currentStep: 'publish',
    });
    return { draft: next, fee };
  }

  async publishDemoListing(id: string, userId: string): Promise<ManagedListing> {
    const draft = await this.requireDraft(id);
    const cover =
      draft.media.images.find((img) => img.isCover) ?? draft.media.images[0];
    const listing: ManagedListing = {
      id: draft.id,
      slug: `listing-${draft.id.toLowerCase()}`,
      title: draft.description.ar.title || getPropertyTypeLabel(draft.propertyType!),
      image: cover?.previewUrl,
      transaction: draft.transaction ?? 'sale',
      propertyType: draft.propertyType!,
      locationLabel: draft.locationLabel ?? '',
      priceEgp: resolveListingDisplayPrice(draft),
      status: 'pending',
      createdAt: draft.createdAt,
      updatedAt: new Date().toISOString(),
      views: 0,
      searchAppearances: 0,
      contacts: 0,
    };

    await getPropertyManagementService().upsertListing(listing);
    await this.repository.saveDraft({
      ...draft,
      status: 'published',
      ownerUserId: userId,
      updatedAt: new Date().toISOString(),
    });
    return listing;
  }

  assertStepAccess(draft: ListingDraft, step: ListingDraftStep): ListingDraftStep {
    if (canAccessListingStep(draft, step)) return step;
    return earliestIncompleteStep(draft);
  }

  getNextStep(step: ListingDraftStep) {
    return nextStepAfter(step);
  }

  private async requireDraft(id: string): Promise<ListingDraft> {
    const draft = await this.repository.getDraft(id);
    if (!draft) throw new Error('المسودة غير موجودة');
    return draft;
  }
}

let service: ListingDraftService | null = null;

export function getListingDraftService(): ListingDraftService {
  if (!service) service = new ListingDraftService();
  return service;
}
