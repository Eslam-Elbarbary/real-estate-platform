import type { FilterChipOption } from '@/config/filter-options';
import type { CatalogTypeDto } from '@/types/api/public-property';

/** Normalize catalog codes for URL/filter values (lowercase slug). */
export function toPropertyTypeSlug(code: string): string {
  return code.trim().toLowerCase();
}

export function catalogPropertyTypeLabel(item: CatalogTypeDto): string {
  return item.nameAr?.trim() || item.nameEn;
}

export function toCatalogPropertyTypeOptions(
  items: CatalogTypeDto[],
): Array<{ value: string; label: string; id: string }> {
  return items.map((item) => ({
    id: item.id,
    value: toPropertyTypeSlug(item.code),
    label: catalogPropertyTypeLabel(item),
  }));
}

/** Chip/select options for public search filters (includes “all”). */
export function toFilterPropertyTypeOptions(
  items: CatalogTypeDto[],
): FilterChipOption[] {
  return [
    { value: 'all', label: 'عقارات' },
    ...toCatalogPropertyTypeOptions(items).map(({ value, label }) => ({
      value,
      label,
    })),
  ];
}
