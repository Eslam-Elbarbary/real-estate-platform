import { Prisma } from '@/prisma/generated/prisma-client';

/** Saved-search filter keys stored in SavedSearchAlert.filters JSON. */
export type AlertFilters = {
  transactionTypeId?: string;
  propertyTypeId?: string;
  countryId?: string;
  cityId?: string;
  areaId?: string;
  districtId?: string;
  compoundId?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  featureIds?: string[];
};

export type PropertyForAlertMatching = {
  transactionTypeId: string | null;
  propertyTypeId: string | null;
  areaId: string | null;
  districtId: string | null;
  compoundId: string | null;
  price: Prisma.Decimal | null;
  areaSqm: Prisma.Decimal | null;
  bedrooms: number | null;
  bathrooms: number | null;
  featureIds: string[];
  cityId: string | null;
  countryId: string | null;
};

function toNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}

function parseAlertFilters(raw: unknown): AlertFilters {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  return raw as AlertFilters;
}

/** Returns true when a published property satisfies all non-empty alert filters. */
export function propertyMatchesAlertFilters(
  property: PropertyForAlertMatching,
  rawFilters: unknown,
): boolean {
  const filters = parseAlertFilters(rawFilters);

  if (filters.transactionTypeId && property.transactionTypeId !== filters.transactionTypeId) {
    return false;
  }
  if (filters.propertyTypeId && property.propertyTypeId !== filters.propertyTypeId) {
    return false;
  }
  if (filters.areaId && property.areaId !== filters.areaId) {
    return false;
  }
  if (filters.districtId && property.districtId !== filters.districtId) {
    return false;
  }
  if (filters.compoundId && property.compoundId !== filters.compoundId) {
    return false;
  }
  if (filters.cityId && property.cityId !== filters.cityId) {
    return false;
  }
  if (filters.countryId && property.countryId !== filters.countryId) {
    return false;
  }

  const price = toNumber(property.price);
  if (filters.priceMin != null && (price == null || price < filters.priceMin)) {
    return false;
  }
  if (filters.priceMax != null && (price == null || price > filters.priceMax)) {
    return false;
  }

  const areaSqm = toNumber(property.areaSqm);
  if (filters.areaMin != null && (areaSqm == null || areaSqm < filters.areaMin)) {
    return false;
  }
  if (filters.areaMax != null && (areaSqm == null || areaSqm > filters.areaMax)) {
    return false;
  }

  if (filters.bedrooms != null && property.bedrooms !== filters.bedrooms) {
    return false;
  }
  if (filters.bathrooms != null && property.bathrooms !== filters.bathrooms) {
    return false;
  }

  if (filters.featureIds && filters.featureIds.length > 0) {
    const required = new Set(filters.featureIds);
    for (const featureId of property.featureIds) {
      required.delete(featureId);
    }
    if (required.size > 0) {
      return false;
    }
  }

  return true;
}
