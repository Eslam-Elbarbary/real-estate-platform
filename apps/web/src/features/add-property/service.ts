import 'server-only';

import {
  createPropertyDraft,
  deletePropertyMedia,
  fetchMyPropertiesList,
  fetchMyPropertyById,
  fetchMyPropertyContact,
  fetchPropertyMedia,
  patchProperty,
  patchPropertyBasic,
  patchPropertyDetails,
  patchPropertyLocation,
  putPropertyFeatures,
  reorderPropertyMedia,
  setPrimaryPropertyMedia,
  upsertMyPropertyContact,
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
import {
  pruneLocalDetailsDraft,
  toHiddenFieldsClearBody,
  toPrunedDetailsPatchBody,
} from './lib/property-type-details';
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
  emptyContactDraft,
  mapContactDtoToDraft,
  mapMyPropertyToListingDraft,
  mapPropertyImagesToMedia,
  resolveCatalogIdByCode,
} from './mappers/from-api-property';
import { resolvePricingAmount } from './lib/pricing';
import {
  canAccessListingStep,
  canResumeFromAddProperty,
  earliestIncompleteStep,
  isPropertyEditable,
} from './lib/step-access';
import type {
  ListingContactDraft,
  ListingDescriptionDraft,
  ListingDetailsDraft,
  ListingDraft,
  ListingDraftStep,
  ListingImageDraft,
  ListingMediaDraft,
  ListingPricingDraft,
} from './types';
import { emptyPricingDraft } from './types';

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
 * Cookie shell is only for unfinished DRAFT/REJECTED UI extras.
 * Never restore cookie state onto submitted listings.
 * View and registration status now live on Property columns — API wins.
 */
function mergeCookieExtrasForPublishOnly(
  draft: ListingDraft,
  cookie: ListingDraft | null,
): ListingDraft {
  if (!cookie) return draft;
  if (!isPropertyEditable(draft.apiStatus)) return draft;
  // Intentionally do not merge pricing / description / media / amenities.
  return {
    ...draft,
    details: {
      ...draft.details,
      // API is source of truth for finishing; cookie is legacy fallback only.
      finishing: draft.details.finishing ?? cookie.details?.finishing,
      mortgageEligible:
        cookie.details?.mortgageEligible ?? draft.details.mortgageEligible,
    },
  };
}

export class ListingDraftService {
  constructor(private readonly repository = getListingDraftRepository()) {}

  async getById(id: string, ownerUserId: string): Promise<ListingDraft | null> {
    try {
      const [dto, catalogs, locations, media, contactDto] = await Promise.all([
        withRefreshedAccessToken((token) => fetchMyPropertyById(token, id)),
        loadCatalogs(),
        getSearchLocationOptions(),
        withRefreshedAccessToken((token) => fetchPropertyMedia(token, id)).catch(
          () => [] as PropertyImageDto[],
        ),
        withRefreshedAccessToken((token) =>
          fetchMyPropertyContact(token, id),
        ).catch(() => null),
      ]);
      const mapped = mapMyPropertyToListingDraft(
        dto,
        catalogs,
        locations,
        ownerUserId,
        media,
      );
      mapped.contact = contactDto
        ? mapContactDtoToDraft(contactDto)
        : emptyContactDraft();
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

  /** API DRAFT rows only — source of truth for /add-property entry. */
  async listApiDraftSummaries(
    ownerUserId: string,
  ): Promise<
    Array<{
      id: string;
      title: string | null;
      status: 'DRAFT';
      updatedAt: string;
      currentStep: ListingDraftStep;
    }>
  > {
    const catalogs = await loadCatalogs();
    const locations = await getSearchLocationOptions();
    const existing = await withRefreshedAccessToken((token) =>
      fetchMyPropertiesList(token, 'DRAFT'),
    );

    const mapped = existing
      .filter((row) => row.status === 'DRAFT')
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((row) => {
        const draft = mapMyPropertyToListingDraft(
          row,
          catalogs,
          locations,
          ownerUserId,
        );
        return {
          id: row.id,
          title: row.title,
          status: 'DRAFT' as const,
          updatedAt: row.updatedAt,
          currentStep: earliestIncompleteStep(draft),
        };
      });

    return mapped;
  }

  async createFreshDraft(ownerUserId: string): Promise<ListingDraft> {
    const catalogs = await loadCatalogs();
    const locations = await getSearchLocationOptions();
    const created = await withRefreshedAccessToken((token) =>
      createPropertyDraft(token, {}),
    );
    const draft = mapMyPropertyToListingDraft(
      created,
      catalogs,
      locations,
      ownerUserId,
    );
    draft.currentStep = earliestIncompleteStep(draft);
    return draft;
  }

  async resumeDraftById(
    ownerUserId: string,
    propertyId: string,
  ): Promise<ListingDraft> {
    const draft = await this.getById(propertyId, ownerUserId);
    if (!draft) {
      throw new Error('المسودة غير موجودة');
    }
    if (!canResumeFromAddProperty(draft.apiStatus)) {
      throw new Error('يمكن استكمال المسودات غير المكتملة فقط');
    }
    draft.currentStep = earliestIncompleteStep(draft);
    return draft;
  }

  /**
   * @deprecated Prefer listApiDraftSummaries + createFreshDraft / resumeDraftById
   * Kept for any callers that still auto-resume the latest draft.
   */
  async startOrResumeDraft(ownerUserId: string): Promise<ListingDraft> {
    const summaries = await this.listApiDraftSummaries(ownerUserId);
    const latest = summaries[0];
    if (latest) {
      return this.resumeDraftById(ownerUserId, latest.id);
    }
    return this.createFreshDraft(ownerUserId);
  }

  listDrafts(_userId: string): Promise<ListingDraft[]> {
    return this.repository.listByUser(_userId);
  }

  deleteDraft(id: string): Promise<void> {
    return this.repository.deleteDraft(id);
  }

  /** Drop any leftover cookie shells after the listing leaves DRAFT. */
  async clearLocalDraftState(propertyId: string): Promise<void> {
    await this.repository.deleteDraft(propertyId).catch(() => undefined);
  }

  async updateBasic(
    id: string,
    ownerUserId: string,
    input: {
      transaction: NonNullable<ListingDraft['transaction']>;
      propertyType: NonNullable<ListingDraft['propertyType']>;
      countryId: string;
      cityId: string;
      areaId: string;
      districtId?: string | null;
      compoundId?: string | null;
      address?: string | null;
      locationLabel: string;
      latitude?: number | null;
      longitude?: number | null;
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
        countryId: input.countryId,
        cityId: input.cityId,
        areaId: input.areaId,
        districtId: input.districtId ?? null,
        compoundId: input.compoundId ?? null,
        address: input.address ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
      });
      // Drop stale residential/commercial detail scalars when type changes.
      const clearBody = toHiddenFieldsClearBody(input.propertyType);
      if (Object.keys(clearBody).length > 0) {
        await patchPropertyDetails(token, id, clearBody);
      }
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
    const current = await this.getById(id, ownerUserId);
    if (!current) throw new Error('المسودة غير موجودة');

    const pruned = pruneLocalDetailsDraft(current.propertyType, details);
    const featureIds = [...new Set(pruned.amenities.filter(Boolean))];
    const detailsBody = toPrunedDetailsPatchBody(
      current.propertyType,
      pruned,
    );

    await withRefreshedAccessToken(async (token) => {
      await patchPropertyDetails(token, id, detailsBody);
      await putPropertyFeatures(token, id, { featureIds });
    });

    // mortgageEligible has no Property column yet — cookie shell only.
    const existingCookie = await this.repository.getById(id);
    if (existingCookie) {
      await this.repository.saveDraft({
        ...existingCookie,
        details: {
          ...existingCookie.details,
          mortgageEligible: pruned.mortgageEligible,
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
        mortgageEligible: pruned.mortgageEligible,
      },
    };
  }

  async updatePricing(
    id: string,
    ownerUserId: string,
    pricing: ListingPricingDraft,
    transaction: ListingDraft['transaction'],
  ): Promise<ListingDraft> {
    const price = resolvePricingAmount(pricing);
    if (price == null || !Number.isFinite(price) || price <= 0) {
      throw new Error('أكمل بيانات السعر');
    }

    const isRent = transaction === 'rent';
    const paymentType = isRent ? null : pricing.paymentType || null;
    const body = {
      price,
      currency: pricing.currency.trim() || 'EGP',
      paymentType: isRent ? null : paymentType,
      rentPeriod: isRent ? pricing.rentPeriod || null : null,
      downPayment:
        !isRent &&
        (paymentType === 'INSTALLMENT' || paymentType === 'CASH_OR_INSTALLMENT')
          ? pricing.downPayment ?? null
          : null,
      installmentYears:
        !isRent &&
        (paymentType === 'INSTALLMENT' || paymentType === 'CASH_OR_INSTALLMENT')
          ? pricing.installmentYears ?? null
          : null,
      monthlyInstallment:
        !isRent &&
        (paymentType === 'INSTALLMENT' || paymentType === 'CASH_OR_INSTALLMENT')
          ? pricing.monthlyInstallment ?? null
          : null,
    };

    await withRefreshedAccessToken((token) => patchProperty(token, id, body));

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

  async updateContact(
    id: string,
    ownerUserId: string,
    contact: ListingContactDraft,
  ): Promise<ListingDraft> {
    const body =
      contact.contactSource === 'OWNER'
        ? {
            source: 'OWNER' as const,
            contactType: 'OWNER' as const,
          }
        : {
            source: 'CUSTOM' as const,
            contactType: contact.contactType,
            name: contact.contactName.trim(),
            phone: contact.phone.trim(),
            whatsapp: contact.whatsapp.trim() || null,
            email: contact.email.trim() || null,
          };

    await withRefreshedAccessToken((token) =>
      upsertMyPropertyContact(token, id, body),
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
    if (draft.apiStatus === 'PENDING_PAYMENT') {
      return 'publish';
    }
    return earliestIncompleteStep(draft);
  }

  getNextStep(step: ListingDraftStep) {
    return nextStepAfter(step);
  }

  /**
   * Optional cookie shell for the remaining UI-only extra (mortgageEligible).
   * All other detail fields persist via the API details PATCH.
   */
  async ensureCookieShell(draft: ListingDraft): Promise<void> {
    if (!isPropertyEditable(draft.apiStatus)) return;
    const existing = await this.repository.getById(draft.id);
    if (existing) return;
    await this.repository.saveDraft({
      ...draft,
      details: {
        ...draft.details,
        amenities: [],
      },
      pricing: emptyPricingDraft(),
      description: {
        ar: { title: '', description: '', address: '' },
        en: { title: '', description: '', address: '' },
      },
      contact: emptyContactDraft(),
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
