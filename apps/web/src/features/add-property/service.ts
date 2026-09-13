import 'server-only';

import {
  createPropertyDraft,
  deletePropertyMedia,
  fetchMyPropertiesList,
  fetchMyPropertyById,
  fetchPropertyMedia,
  patchProperty,
  patchPropertyBasic,
  patchPropertyDetails,
  patchPropertyLocation,
  putPropertyFeatures,
  reorderPropertyMedia,
  setPrimaryPropertyMedia,
  uploadPropertyMedia,
} from '@/data/repositories/api-property-drafts';
import {
  createPropertySubscription,
  fetchActivePlans,
  fetchPropertyCompletion,
  fetchPropertySubscription,
  paySubscription,
  resubmitProperty,
} from '@/data/repositories/api-listing-submission';
import { withRefreshedAccessToken } from '@/features/auth/session';
import { getSearchLocationOptions } from '@/features/locations/api-options';
import type { LocationOption } from '@/features/locations';
import {
  fetchPropertyTypes,
  fetchTransactionTypes,
} from '@/features/properties/api/catalogs';
import { ApiRequestError } from '@/lib/api/errors';
import type { CatalogTypeDto } from '@/types/api/public-property';
import type { PropertyImageDto } from '@/types/api/my-property';
import type {
  ListingPaymentDto,
  ListingPlanDto,
  ListingSubscriptionDto,
  PropertyCompletionDto,
} from '@/types/api/listing-submission';
import {
  getListingDraftRepository,
  nextStepAfter,
} from './repository';
import {
  mapMyPropertyToListingDraft,
  mapPropertyImagesToMedia,
  resolveCatalogIdByCode,
} from './mappers/from-api-property';
import { resolvePricingAmount } from './lib/pricing';
import {
  canAccessListingStep,
  earliestIncompleteStep,
} from './lib/step-access';
import type {
  ListingDescriptionDraft,
  ListingDetailsDraft,
  ListingDraft,
  ListingDraftStep,
  ListingImageDraft,
  ListingMediaDraft,
  ListingPricingDraft,
} from './types';

async function loadCatalogs(): Promise<{
  propertyTypes: CatalogTypeDto[];
  transactionTypes: CatalogTypeDto[];
}> {
  const [propertyTypes, transactionTypes] = await Promise.all([
    fetchPropertyTypes(),
    fetchTransactionTypes(),
  ]);
  return { propertyTypes, transactionTypes };
}

/**
 * Cookie shell is only for unfinished publish/checkout (Phase 7D).
 * Price, description, features, and media must not be restored from cookies.
 */
function mergeCookieExtrasForPublishOnly(
  draft: ListingDraft,
  cookie: ListingDraft | null,
): ListingDraft {
  if (!cookie) return draft;
  // Intentionally do not merge pricing / description / media / amenities.
  return {
    ...draft,
    details: {
      ...draft.details,
      views: cookie.details?.views?.length ? cookie.details.views : draft.details.views,
      finishing: cookie.details?.finishing ?? draft.details.finishing,
      registrationStatus:
        cookie.details?.registrationStatus ?? draft.details.registrationStatus,
      mortgageEligible:
        cookie.details?.mortgageEligible ?? draft.details.mortgageEligible,
    },
  };
}

export class ListingDraftService {
  constructor(private readonly repository = getListingDraftRepository()) {}

  async getById(id: string, ownerUserId: string): Promise<ListingDraft | null> {
    try {
      const [dto, catalogs, locations, media] = await Promise.all([
        withRefreshedAccessToken((token) => fetchMyPropertyById(token, id)),
        loadCatalogs(),
        getSearchLocationOptions(),
        withRefreshedAccessToken((token) => fetchPropertyMedia(token, id)).catch(
          () => [] as PropertyImageDto[],
        ),
      ]);
      const mapped = mapMyPropertyToListingDraft(
        dto,
        catalogs,
        locations,
        ownerUserId,
        media,
      );
      mapped.currentStep = earliestIncompleteStep(mapped);
      const cookie = await this.repository.getById(id);
      return mergeCookieExtrasForPublishOnly(mapped, cookie);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  getDraft(id: string, ownerUserId: string): Promise<ListingDraft | null> {
    return this.getById(id, ownerUserId);
  }

  async startOrResumeDraft(ownerUserId: string): Promise<ListingDraft> {
    const catalogs = await loadCatalogs();
    const locations = await getSearchLocationOptions();

    const existing = await withRefreshedAccessToken((token) =>
      fetchMyPropertiesList(token, 'DRAFT'),
    );
    const sorted = [...existing].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
    const latest = sorted[0];

    if (latest) {
      const media = await withRefreshedAccessToken((token) =>
        fetchPropertyMedia(token, latest.id),
      ).catch(() => [] as PropertyImageDto[]);
      const mapped = mapMyPropertyToListingDraft(
        latest,
        catalogs,
        locations,
        ownerUserId,
        media,
      );
      const cookie = await this.repository.getById(latest.id);
      const merged = mergeCookieExtrasForPublishOnly(mapped, cookie);
      merged.currentStep = earliestIncompleteStep(merged);
      return merged;
    }

    const created = await withRefreshedAccessToken((token) =>
      createPropertyDraft(token, {}),
    );
    return mapMyPropertyToListingDraft(
      created,
      catalogs,
      locations,
      ownerUserId,
    );
  }

  listDrafts(_userId: string): Promise<ListingDraft[]> {
    return this.repository.listByUser(_userId);
  }

  deleteDraft(id: string): Promise<void> {
    return this.repository.deleteDraft(id);
  }

  async updateBasic(
    id: string,
    ownerUserId: string,
    input: {
      transaction: NonNullable<ListingDraft['transaction']>;
      propertyType: NonNullable<ListingDraft['propertyType']>;
      locationId: string;
      locationLabel: string;
      latitude: number;
      longitude: number;
      areaId: string;
      districtId?: string | null;
    },
  ): Promise<ListingDraft> {
    const catalogs = await loadCatalogs();
    const propertyTypeId = resolveCatalogIdByCode(
      catalogs.propertyTypes,
      input.propertyType,
    );
    const transactionTypeId = resolveCatalogIdByCode(
      catalogs.transactionTypes,
      input.transaction === 'rent' ? 'RENT' : 'SALE',
    );

    if (!propertyTypeId || !transactionTypeId) {
      throw new Error('تعذر مطابقة نوع العقار أو نوع العملية مع الكتالوج');
    }

    await withRefreshedAccessToken(async (token) => {
      await patchPropertyBasic(token, id, {
        propertyTypeId,
        transactionTypeId,
      });
      await patchPropertyLocation(token, id, {
        areaId: input.areaId,
        districtId: input.districtId ?? null,
        latitude: input.latitude,
        longitude: input.longitude,
      });
    });

    const draft = await this.getById(id, ownerUserId);
    if (!draft) throw new Error('المسودة غير موجودة');
    return draft;
  }

  async updateDetails(
    id: string,
    ownerUserId: string,
    details: ListingDetailsDraft,
  ): Promise<ListingDraft> {
    const floorNumber =
      details.floor === undefined || details.floor === ''
        ? null
        : typeof details.floor === 'number'
          ? details.floor
          : Number.parseInt(String(details.floor), 10);

    const featureIds = [...new Set(details.amenities.filter(Boolean))];

    await withRefreshedAccessToken(async (token) => {
      await patchPropertyDetails(token, id, {
        areaSqm: details.areaSqm ?? null,
        bedrooms: details.bedrooms ?? null,
        bathrooms: details.bathrooms ?? null,
        floor:
          floorNumber != null && Number.isFinite(floorNumber)
            ? floorNumber
            : null,
        yearBuilt: details.buildOrDeliveryYear ?? null,
        furnished: details.furnished ?? null,
        rentPeriod: details.rentPeriod ?? null,
      });
      await putPropertyFeatures(token, id, { featureIds });
    });

    // UI-only fields (views/finishing/etc.) for later publish demo — not amenities.
    const existingCookie = await this.repository.getById(id);
    if (existingCookie) {
      await this.repository.saveDraft({
        ...existingCookie,
        details: {
          ...existingCookie.details,
          views: details.views,
          finishing: details.finishing,
          registrationStatus: details.registrationStatus,
          mortgageEligible: details.mortgageEligible,
          amenities: [],
        },
        currentStep: 'price',
      });
    }

    const draft = await this.getById(id, ownerUserId);
    if (!draft) throw new Error('المسودة غير موجودة');
    // PUT features response includes features, but GET /me/:id does not —
    // keep the just-saved selection in the returned draft for this request only.
    return {
      ...draft,
      details: {
        ...draft.details,
        amenities: featureIds,
        views: details.views,
        finishing: details.finishing,
        registrationStatus: details.registrationStatus,
        mortgageEligible: details.mortgageEligible,
      },
    };
  }

  async updatePricing(
    id: string,
    ownerUserId: string,
    pricing: ListingPricingDraft,
  ): Promise<ListingDraft> {
    const price = resolvePricingAmount(pricing);
    if (price == null || !Number.isFinite(price) || price <= 0) {
      throw new Error('أكمل بيانات السعر');
    }

    await withRefreshedAccessToken((token) =>
      patchProperty(token, id, { price }),
    );

    const draft = await this.getById(id, ownerUserId);
    if (!draft) throw new Error('المسودة غير موجودة');
    return draft;
  }

  async updateDescription(
    id: string,
    ownerUserId: string,
    description: ListingDescriptionDraft,
  ): Promise<ListingDraft> {
    await withRefreshedAccessToken((token) =>
      patchProperty(token, id, {
        title: description.ar.title.trim(),
        description: description.ar.description.trim(),
        address: description.ar.address.trim() || null,
      }),
    );

    const draft = await this.getById(id, ownerUserId);
    if (!draft) throw new Error('المسودة غير موجودة');
    return draft;
  }

  async updateMedia(
    id: string,
    ownerUserId: string,
  ): Promise<ListingDraft> {
    const draft = await this.getById(id, ownerUserId);
    if (!draft) throw new Error('المسودة غير موجودة');
    if (draft.media.images.length < 1) {
      throw new Error('أضف صورة واحدةً على الأقل');
    }
    return draft;
  }

  async listMedia(id: string): Promise<ListingImageDraft[]> {
    const images = await withRefreshedAccessToken((token) =>
      fetchPropertyMedia(token, id),
    );
    return mapPropertyImagesToMedia(images);
  }

  async uploadMediaImage(
    id: string,
    file: File,
  ): Promise<ListingImageDraft[]> {
    await withRefreshedAccessToken((token) =>
      uploadPropertyMedia(token, id, file),
    );
    return this.listMedia(id);
  }

  async deleteMediaImage(
    id: string,
    imageId: string,
  ): Promise<ListingImageDraft[]> {
    await withRefreshedAccessToken((token) =>
      deletePropertyMedia(token, id, imageId),
    );
    const remaining = await this.listMedia(id);
    if (remaining.length <= 1) return remaining;

    await withRefreshedAccessToken((token) =>
      reorderPropertyMedia(token, id, {
        images: remaining.map((img, index) => ({
          id: img.id,
          sortOrder: index,
        })),
      }),
    );

    return this.listMedia(id);
  }

  async setPrimaryMediaImage(
    id: string,
    imageId: string,
  ): Promise<ListingImageDraft[]> {
    await withRefreshedAccessToken((token) =>
      setPrimaryPropertyMedia(token, id, imageId),
    );
    return this.listMedia(id);
  }

  async reorderMediaImages(
    id: string,
    orderedIds: string[],
  ): Promise<ListingImageDraft[]> {
    await withRefreshedAccessToken((token) =>
      reorderPropertyMedia(token, id, {
        images: orderedIds.map((imageId, index) => ({
          id: imageId,
          sortOrder: index,
        })),
      }),
    );
    return this.listMedia(id);
  }

  getCompletion(propertyId: string): Promise<PropertyCompletionDto> {
    return withRefreshedAccessToken((token) =>
      fetchPropertyCompletion(token, propertyId),
    );
  }

  listPlans(): Promise<ListingPlanDto[]> {
    return fetchActivePlans();
  }

  getOpenSubscription(
    propertyId: string,
  ): Promise<ListingSubscriptionDto | null> {
    return withRefreshedAccessToken((token) =>
      fetchPropertySubscription(token, propertyId),
    ).catch((error) => {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      throw error;
    });
  }

  selectPlan(
    propertyId: string,
    planId: string,
  ): Promise<ListingSubscriptionDto> {
    return withRefreshedAccessToken((token) =>
      createPropertySubscription(token, propertyId, planId),
    );
  }

  payListingSubscription(subscriptionId: string): Promise<ListingPaymentDto> {
    return withRefreshedAccessToken((token) =>
      paySubscription(token, subscriptionId),
    );
  }

  async resubmitRejectedForOwner(
    propertyId: string,
    ownerUserId: string,
  ): Promise<ListingDraft> {
    await withRefreshedAccessToken((token) =>
      resubmitProperty(token, propertyId),
    );
    const draft = await this.getById(propertyId, ownerUserId);
    if (!draft) throw new Error('المسودة غير موجودة');
    return draft;
  }

  assertStepAccess(draft: ListingDraft, step: ListingDraftStep): ListingDraftStep {
    if (canAccessListingStep(draft, step)) return step;
    if (
      draft.apiStatus === 'PENDING_REVIEW' ||
      draft.apiStatus === 'PUBLISHED' ||
      draft.apiStatus === 'ARCHIVED' ||
      draft.apiStatus === 'EXPIRED'
    ) {
      return 'publish';
    }
    if (draft.apiStatus === 'PENDING_PAYMENT') {
      return 'publish';
    }
    return earliestIncompleteStep(draft);
  }

  getNextStep(step: ListingDraftStep) {
    return nextStepAfter(step);
  }

  /**
   * Optional cookie shell for UI-only details extras (views/finishing).
   * Not used for submission state.
   */
  async ensureCookieShell(draft: ListingDraft): Promise<void> {
    const existing = await this.repository.getById(draft.id);
    if (existing) return;
    await this.repository.saveDraft({
      ...draft,
      details: {
        ...draft.details,
        amenities: [],
      },
      pricing: { mode: null },
      description: {
        ar: { title: '', description: '', address: '' },
        en: { title: '', description: '', address: '' },
      },
      media: { images: [] },
    });
  }
}

let service: ListingDraftService | null = null;

export function getListingDraftService(): ListingDraftService {
  if (!service) service = new ListingDraftService();
  return service;
}

export type { LocationOption };
export type { ListingMediaDraft };
