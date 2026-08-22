import type { PropertyType, TransactionType } from '@/types';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';

export interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  group: 'residential' | 'commercial' | 'land';
}

export const propertyTypeOptions: PropertyTypeOption[] = [
  { value: 'apartment', label: 'شقة', group: 'residential' },
  { value: 'villa', label: 'فيلا', group: 'residential' },
  { value: 'townhouse', label: 'تاون هاوس', group: 'residential' },
  { value: 'duplex', label: 'دوبلكس', group: 'residential' },
  { value: 'penthouse', label: 'بنتهاوس', group: 'residential' },
  { value: 'studio', label: 'ستوديو', group: 'residential' },
  { value: 'chalet', label: 'شاليه', group: 'residential' },
  { value: 'office', label: 'إداري', group: 'commercial' },
  { value: 'shop', label: 'تجاري', group: 'commercial' },
  { value: 'land', label: 'أرض', group: 'land' },
];

export const propertyTypeLabelMap: Record<PropertyType, string> = Object.fromEntries(
  propertyTypeOptions.map((option) => [option.value, option.label]),
) as Record<PropertyType, string>;

export function getPropertyTypeLabel(type: PropertyType): string {
  return propertyTypeLabelMap[type];
}

export type SearchMode = TransactionType | 'compounds';

export interface SearchModeOption {
  value: SearchMode;
  label: string;
}

export const searchModeOptions: SearchModeOption[] = [
  { value: 'sale', label: uiLabels.buy },
  { value: 'rent', label: uiLabels.rent },
  { value: 'compounds', label: uiLabels.compounds },
];

export const transactionOptions = searchModeOptions.filter(
  (option): option is SearchModeOption & { value: TransactionType } =>
    option.value === 'sale' || option.value === 'rent',
);

export function getSearchModeHref(
  mode: SearchMode,
  locationSlugs?: string[],
): string {
  if (mode === 'compounds') {
    return locationSlugs?.length
      ? routes.compounds.byLocation(locationSlugs)
      : routes.compounds.root;
  }

  return '';
}
