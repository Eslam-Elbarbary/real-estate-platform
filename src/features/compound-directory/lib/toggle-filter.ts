import type { CompoundSearchFilters } from '@/types';
import { buildCompoundSearchPath } from '../search-params';

function toggleInList<T extends string>(
  list: T[] | undefined,
  value: T,
): T[] | undefined {
  const current = list ?? [];
  if (current.includes(value)) {
    const next = current.filter((item) => item !== value);
    return next.length ? next : undefined;
  }

  return [...current, value];
}

export function hrefForLocationToggle(
  filters: CompoundSearchFilters,
  slug: string,
): string {
  const current = filters.locationSlugs ?? [];
  const next = current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [...current, slug];

  return buildCompoundSearchPath({
    ...filters,
    locationSlugs: next.length ? next : undefined,
    page: 1,
  });
}

export function hrefForPropertyTypeToggle(
  filters: CompoundSearchFilters,
  type: NonNullable<CompoundSearchFilters['propertyTypes']>[number],
): string {
  return buildCompoundSearchPath({
    ...filters,
    propertyTypes: toggleInList(filters.propertyTypes, type),
    page: 1,
  });
}

export function hrefForPriceLevel(
  filters: CompoundSearchFilters,
  value: NonNullable<CompoundSearchFilters['priceLevel']>,
): string {
  return buildCompoundSearchPath({
    ...filters,
    priceLevel: filters.priceLevel === value ? undefined : value,
    page: 1,
  });
}

export function hrefForConstructionStatus(
  filters: CompoundSearchFilters,
  value: NonNullable<CompoundSearchFilters['constructionStatus']>,
): string {
  return buildCompoundSearchPath({
    ...filters,
    constructionStatus:
      filters.constructionStatus === value ? undefined : value,
    page: 1,
  });
}

export function hrefForFinishingToggle(
  filters: CompoundSearchFilters,
  value: NonNullable<CompoundSearchFilters['finishingTypes']>[number],
): string {
  return buildCompoundSearchPath({
    ...filters,
    finishingTypes: toggleInList(filters.finishingTypes, value),
    page: 1,
  });
}

export function hrefForPaymentToggle(
  filters: CompoundSearchFilters,
  value: NonNullable<CompoundSearchFilters['paymentMethods']>[number],
): string {
  return buildCompoundSearchPath({
    ...filters,
    paymentMethods: toggleInList(filters.paymentMethods, value),
    page: 1,
  });
}

export function hrefForSort(
  filters: CompoundSearchFilters,
  sort: NonNullable<CompoundSearchFilters['sort']>,
): string {
  return buildCompoundSearchPath({
    ...filters,
    sort,
    page: 1,
  });
}

export function hrefForResetFilters(filters: CompoundSearchFilters): string {
  return buildCompoundSearchPath({
    locationSlugs: filters.locationSlugs,
    sort: 'recommended',
    page: 1,
  });
}
