import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { PropertySearchFilters, PropertyType } from '@/types';

export interface SubtypeChip {
  id: string;
  label: string;
  href: string;
  count: number;
  selected: boolean;
}

interface ChipDef {
  id: string;
  label: string;
  propertyType?: PropertyType;
  feature?: string;
}

const CHIP_DEFS: ChipDef[] = [
  { id: 'apartment', label: 'شقق', propertyType: 'apartment' },
  { id: 'garden', label: 'شقة بحديقة', feature: 'شقة بحديقة' },
  { id: 'duplex', label: 'دوبلكس', propertyType: 'duplex' },
  { id: 'roof', label: 'روف', feature: 'روف' },
  { id: 'studio', label: 'ستوديو', propertyType: 'studio' },
  { id: 'penthouse', label: 'بنتهاوس', propertyType: 'penthouse' },
  { id: 'residential', label: 'سكني', feature: 'سكني' },
  { id: 'duplex-garden', label: 'دوبلكس بحديقة', feature: 'دوبلكس بحديقة' },
  { id: 'full-floor', label: 'دور كامل', feature: 'دور كامل' },
  { id: 'hotel-studio', label: 'ستوديو فندقي', feature: 'ستوديو فندقي' },
];

export function buildSubtypeChips(
  filters: PropertySearchFilters,
  counts: Record<string, number>,
): SubtypeChip[] {
  return CHIP_DEFS.map((chip) => {
    const count = chip.propertyType
      ? (counts[chip.propertyType] ?? 0)
      : chip.feature
        ? (counts[chip.feature] ?? 0)
        : 0;

    const nextFilters: PropertySearchFilters = {
      ...filters,
      page: 1,
      propertyType: chip.propertyType ?? filters.propertyType,
      propertyTypes: undefined,
      keyword: chip.feature ?? undefined,
    };

    if (chip.feature && !chip.propertyType) {
      nextFilters.propertyType = filters.propertyType ?? 'apartment';
      nextFilters.keyword = chip.feature;
    }

    const selected = chip.propertyType
      ? filters.propertyType === chip.propertyType && !filters.keyword
      : filters.keyword === chip.feature;

    return {
      id: chip.id,
      label: chip.label,
      href: buildPropertySearchPath(nextFilters),
      count,
      selected,
    };
  }).filter((chip) => chip.count > 0 || chip.selected);
}
