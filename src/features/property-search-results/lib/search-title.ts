import { siteConfig } from '@/config/site';
import { getPropertyTypeLabel } from '@/config/property-types';
import type { PropertySearchFilters, PropertyType, TransactionType } from '@/types';

const transactionPhrase: Record<TransactionType, string> = {
  sale: 'للبيع',
  rent: 'للإيجار',
};

export function getResultsHeading(filters: PropertySearchFilters): string {
  const transaction = filters.transactionType ?? 'sale';
  const typeLabel = filters.propertyType
    ? pluralizeType(filters.propertyType)
    : 'عقارات';

  return `${typeLabel} ${transactionPhrase[transaction]}`;
}

export function getResultsCountLabel(
  total: number,
  filters: PropertySearchFilters,
): string {
  const formatter = new Intl.NumberFormat(siteConfig.locale);
  const unit = filters.propertyType
    ? singularUnit(filters.propertyType)
    : 'عقار';

  return `${formatter.format(total)} ${unit}`;
}

export function getResultsMetadataTitle(filters: PropertySearchFilters): string {
  const heading = getResultsHeading(filters);
  const location = filters.locationSlugs?.length
    ? ` في ${filters.locationSlugs[filters.locationSlugs.length - 1]}`
    : '';
  const page =
    filters.page && filters.page > 1 ? ` — صفحة ${filters.page}` : '';

  return `${heading}${location}${page}`;
}

export function getResultsMetadataDescription(
  filters: PropertySearchFilters,
  total: number,
): string {
  const heading = getResultsHeading(filters);
  const count = new Intl.NumberFormat(siteConfig.locale).format(total);
  return `تصفح ${count} من ${heading} على ${siteConfig.name}. فلتر حسب السعر والمساحة والموقع واعثر على العقار المناسب.`;
}

function pluralizeType(type: PropertyType): string {
  const map: Partial<Record<PropertyType, string>> = {
    apartment: 'شقق',
    villa: 'فلل',
    townhouse: 'تاون هاوس',
    duplex: 'دوبلكس',
    penthouse: 'بنتهاوس',
    studio: 'استوديوهات',
    chalet: 'شاليهات',
    office: 'مكاتب إدارية',
    shop: 'محلات تجارية',
    land: 'أراضي',
  };

  return map[type] ?? getPropertyTypeLabel(type);
}

function singularUnit(type: PropertyType): string {
  const map: Partial<Record<PropertyType, string>> = {
    apartment: 'شقة',
    villa: 'فيلا',
    townhouse: 'تاون هاوس',
    duplex: 'دوبلكس',
    penthouse: 'بنتهاوس',
    studio: 'استوديو',
    chalet: 'شاليه',
    office: 'مكتب',
    shop: 'محل',
    land: 'قطعة أرض',
  };

  return map[type] ?? 'عقار';
}
