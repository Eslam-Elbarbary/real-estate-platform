import type { LocationOption } from '@/features/locations/service';
import type { AlertDto } from '@/types/api/alerts';
import type { PropertyType, TransactionType } from '@/types';
import type { PropertyAlert, PropertyAlertLocation } from '../types';

/**
 * Mirrors the backend's `AlertFilters` type
 * (apps/api/src/modules/alerts/utils/alert-filter-match.util.ts) — these keys
 * are read by SavedSearchMatchingService when a new property is published.
 * `display` is our own extension; the matching engine ignores unknown keys.
 */
interface AlertFiltersPayload {
  transactionTypeId?: string;
  propertyTypeId?: string;
  cityId?: string;
  areaId?: string;
  districtId?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  display?: {
    transactionCode: TransactionType;
    propertyTypeCode: PropertyType;
    locations: PropertyAlertLocation[];
  };
}

/** Resolve the strongest available match id for a single selected location option. */
export function resolveLocationMatchIds(option: LocationOption): {
  cityId?: string;
  areaId?: string;
  districtId?: string;
} {
  if (option.level === 'neighborhood') {
    return { districtId: option.districtId ?? option.id, areaId: option.areaId };
  }
  if (option.level === 'area') {
    return { areaId: option.areaId ?? option.id };
  }
  if (option.level === 'city') {
    return { cityId: option.id };
  }
  return {};
}

export function buildAlertFilters(input: {
  propertyTypeId?: string;
  transactionTypeId?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  transactionCode: TransactionType;
  propertyTypeCode: PropertyType;
  locations: PropertyAlertLocation[];
  matchIds: { cityId?: string; areaId?: string; districtId?: string };
}): Record<string, unknown> {
  const filters: AlertFiltersPayload = {
    display: {
      transactionCode: input.transactionCode,
      propertyTypeCode: input.propertyTypeCode,
      locations: input.locations,
    },
  };

  if (input.transactionTypeId) filters.transactionTypeId = input.transactionTypeId;
  if (input.propertyTypeId) filters.propertyTypeId = input.propertyTypeId;
  if (input.matchIds.cityId) filters.cityId = input.matchIds.cityId;
  if (input.matchIds.areaId) filters.areaId = input.matchIds.areaId;
  if (input.matchIds.districtId) filters.districtId = input.matchIds.districtId;
  if (input.priceMin != null) filters.priceMin = input.priceMin;
  if (input.priceMax != null) filters.priceMax = input.priceMax;
  if (input.areaMin != null) filters.areaMin = input.areaMin;
  if (input.areaMax != null) filters.areaMax = input.areaMax;

  return filters as Record<string, unknown>;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function mapAlertDtoToPropertyAlert(dto: AlertDto): PropertyAlert {
  const filters = (dto.filters ?? {}) as AlertFiltersPayload;
  const display = filters.display;

  return {
    id: dto.id,
    locations: display?.locations ?? [],
    transaction: display?.transactionCode ?? 'sale',
    propertyType: display?.propertyTypeCode ?? 'apartment',
    minPrice: isFiniteNumber(filters.priceMin) ? filters.priceMin : undefined,
    maxPrice: isFiniteNumber(filters.priceMax) ? filters.priceMax : undefined,
    minArea: isFiniteNumber(filters.areaMin) ? filters.areaMin : undefined,
    maxArea: isFiniteNumber(filters.areaMax) ? filters.areaMax : undefined,
    enabled: dto.isActive,
    createdAt: dto.createdAt,
  };
}
