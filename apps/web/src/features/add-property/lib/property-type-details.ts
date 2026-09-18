import {
  CLEARABLE_DETAIL_FIELDS,
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
  type PropertyDetailField,
} from '@repo/types';
import type { FinishingType } from '@/types';
import type { ApiFinishingType } from '@/types/api/public-property';
import { toApiFinishingType } from '@/features/properties/mappers/to-property-card';
import type { ListingDetailsDraft } from '../types';
import type { UpdateDetailsBody } from '@/data/repositories/api-property-drafts';

export {
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
  type PropertyDetailField,
};

/**
 * Build owner details PATCH body with hidden fields forced to null
 * so stale apartment values never leak into LAND / commercial listings.
 */
export function toPrunedDetailsPatchBody(
  propertyTypeCode: string | null | undefined,
  details: ListingDetailsDraft,
): UpdateDetailsBody {
  const floorNumber =
    details.floor === undefined || details.floor === ''
      ? null
      : typeof details.floor === 'number'
        ? details.floor
        : Number.parseInt(String(details.floor), 10);

  const visible = (field: PropertyDetailField) =>
    isDetailFieldVisible(field, propertyTypeCode);

  const finishingApi: ApiFinishingType | null = visible('finishingType')
    ? (toApiFinishingType(details.finishing as FinishingType | undefined) ??
      null)
    : null;

  return {
    areaSqm: visible('areaSqm') ? (details.areaSqm ?? null) : null,
    bedrooms: visible('bedrooms') ? (details.bedrooms ?? null) : null,
    bathrooms: visible('bathrooms') ? (details.bathrooms ?? null) : null,
    floor:
      visible('floor') && floorNumber != null && Number.isFinite(floorNumber)
        ? floorNumber
        : null,
    yearBuilt: visible('yearBuilt')
      ? (details.buildOrDeliveryYear ?? null)
      : null,
    furnished: visible('furnished') ? (details.furnished ?? null) : null,
    finishingType: finishingApi,
    rentPeriod: details.rentPeriod ?? null,
    propertyViewIds: visible('propertyViews')
      ? (details.propertyViewIds ?? [])
      : [],
    legalStatusId: visible('legalStatus')
      ? (details.legalStatusId ?? null)
      : null,
  };
}

/** Null-out only fields that are hidden for the new type (type-change prune). */
export function toHiddenFieldsClearBody(
  propertyTypeCode: string | null | undefined,
): UpdateDetailsBody {
  const body: UpdateDetailsBody = {};
  for (const field of CLEARABLE_DETAIL_FIELDS) {
    if (isDetailFieldVisible(field, propertyTypeCode)) continue;
    switch (field) {
      case 'bedrooms':
        body.bedrooms = null;
        break;
      case 'bathrooms':
        body.bathrooms = null;
        break;
      case 'floor':
        body.floor = null;
        break;
      case 'yearBuilt':
        body.yearBuilt = null;
        break;
      case 'finishingType':
        body.finishingType = null;
        break;
      case 'furnished':
        body.furnished = null;
        break;
      case 'propertyViews':
        body.propertyViewIds = [];
        break;
      case 'legalStatus':
        body.legalStatusId = null;
        break;
      default:
        break;
    }
  }
  return body;
}

export function pruneLocalDetailsDraft(
  propertyTypeCode: string | null | undefined,
  details: ListingDetailsDraft,
): ListingDetailsDraft {
  const next = { ...details };
  if (!isDetailFieldVisible('bedrooms', propertyTypeCode)) {
    next.bedrooms = undefined;
  }
  if (!isDetailFieldVisible('bathrooms', propertyTypeCode)) {
    next.bathrooms = undefined;
  }
  if (!isDetailFieldVisible('floor', propertyTypeCode)) {
    next.floor = undefined;
  }
  if (!isDetailFieldVisible('yearBuilt', propertyTypeCode)) {
    next.buildOrDeliveryYear = undefined;
  }
  if (!isDetailFieldVisible('finishingType', propertyTypeCode)) {
    next.finishing = undefined;
  }
  if (!isDetailFieldVisible('furnished', propertyTypeCode)) {
    next.furnished = undefined;
  }
  if (!isDetailFieldVisible('propertyViews', propertyTypeCode)) {
    next.propertyViewIds = undefined;
  }
  if (!isDetailFieldVisible('legalStatus', propertyTypeCode)) {
    next.legalStatusId = undefined;
  }
  return next;
}

export function sortFeaturesByRecommendation<T extends { code: string }>(
  features: T[],
  propertyTypeCode: string | null | undefined,
): T[] {
  const recommended = new Set(
    getPropertyTypeFieldConfig(propertyTypeCode).recommendedFeatureCodes ?? [],
  );
  if (recommended.size === 0) return features;
  return [...features].sort((a, b) => {
    const aRec = recommended.has(a.code.toUpperCase()) ? 0 : 1;
    const bRec = recommended.has(b.code.toUpperCase()) ? 0 : 1;
    return aRec - bRec;
  });
}

export function isRecommendedFeature(
  featureCode: string,
  propertyTypeCode: string | null | undefined,
): boolean {
  const codes =
    getPropertyTypeFieldConfig(propertyTypeCode).recommendedFeatureCodes ?? [];
  return codes.includes(featureCode.trim().toUpperCase());
}
