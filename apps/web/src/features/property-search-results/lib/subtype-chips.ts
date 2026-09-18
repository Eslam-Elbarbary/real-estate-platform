import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { PropertySearchFilters } from '@/types';

export interface SubtypeChip {
  id: string;
  label: string;
  href: string;
  count: number;
  selected: boolean;
}

export interface SubtypePropertyTypeOption {
  value: string;
  label: string;
}

/**
 * Build result chips from live catalog property types (admin source of truth).
 * Counts are optional until a facet API exists.
 */
export function buildSubtypeChips(
  filters: PropertySearchFilters,
  counts: Record<string, number>,
  propertyTypeOptions: SubtypePropertyTypeOption[],
): SubtypeChip[] {
  return propertyTypeOptions.map((option) => {
    const selected =
      filters.propertyType === option.value && !filters.keyword;

    return {
      id: option.value,
      label: option.label,
      href: buildPropertySearchPath({
        ...filters,
        page: 1,
        propertyType: option.value,
        propertyTypes: undefined,
        keyword: undefined,
      }),
      count: counts[option.value] ?? 0,
      selected,
    };
  });
}
