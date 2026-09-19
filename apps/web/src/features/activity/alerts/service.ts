import 'server-only';

import {
  createAlertApi,
  deleteAlertApi,
  fetchAlerts,
  updateAlertApi,
} from '@/data/repositories/api-alerts';
import { withRefreshedAccessToken } from '@/features/auth/session';
import { getSearchLocationOptions } from '@/features/locations/api-options';
import type { LocationOption } from '@/features/locations/service';
import {
  fetchPropertyTypes,
  fetchTransactionTypes,
} from '@/features/properties/api/catalogs';
import {
  catalogPropertyTypeLabel,
  toPropertyTypeSlug,
} from '@/features/properties/lib/property-type-options';
import type { CatalogTypeDto } from '@/types/api/public-property';
import type { CreatePropertyAlertInput, PropertyAlert } from '../types';
import {
  buildAlertFilters,
  mapAlertDtoToPropertyAlert,
  resolveLocationMatchIds,
} from './mapper';

async function loadCatalogs(): Promise<{
  propertyTypes: CatalogTypeDto[];
  transactionTypes: CatalogTypeDto[];
}> {
  const [propertyTypes, transactionTypes] = await Promise.all([
    fetchPropertyTypes().catch(() => []),
    fetchTransactionTypes().catch(() => []),
  ]);
  return { propertyTypes, transactionTypes };
}

/** Backend requires a non-empty alert name; the UI never collects one, so derive it. */
function buildAlertName(
  locations: LocationOption[],
  propertyType: CatalogTypeDto | undefined,
  transaction: 'sale' | 'rent',
): string {
  const typeName = propertyType ? catalogPropertyTypeLabel(propertyType) : '';
  const transactionName = transaction === 'rent' ? 'إيجار' : 'بيع';
  const locationNames = locations.map((item) => item.name).join('، ');
  return `${typeName} لل${transactionName} - ${locationNames}`.slice(0, 200);
}

export class AlertsService {
  async list(_userId: string): Promise<PropertyAlert[]> {
    void _userId;
    const dtos = await withRefreshedAccessToken((token) => fetchAlerts(token));
    return dtos
      .map(mapAlertDtoToPropertyAlert)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  listLocationOptions(): Promise<LocationOption[]> {
    return getSearchLocationOptions();
  }

  async create(
    _userId: string,
    input: Omit<CreatePropertyAlertInput, 'locations'> & {
      locationSlugs: string[];
    },
  ): Promise<PropertyAlert> {
    void _userId;
    const [locations, catalogs] = await Promise.all([
      getSearchLocationOptions(),
      loadCatalogs(),
    ]);

    const selected = input.locationSlugs
      .map((slug) => locations.find((item) => item.slug === slug))
      .filter((item): item is LocationOption => Boolean(item));

    if (selected.length === 0) {
      throw new Error('LOCATION_REQUIRED');
    }

    const propertyTypeEntry = catalogs.propertyTypes.find(
      (item) => toPropertyTypeSlug(item.code) === input.propertyType,
    );
    const transactionTypeEntry = catalogs.transactionTypes.find(
      (item) =>
        item.code.toUpperCase() ===
        (input.transaction === 'rent' ? 'RENT' : 'SALE'),
    );

    const filters = buildAlertFilters({
      propertyTypeId: propertyTypeEntry?.id,
      transactionTypeId: transactionTypeEntry?.id,
      priceMin: input.minPrice,
      priceMax: input.maxPrice,
      areaMin: input.minArea,
      areaMax: input.maxArea,
      transactionCode: input.transaction,
      propertyTypeCode: input.propertyType,
      locations: selected.map((item) => ({
        id: item.id,
        slug: item.slug,
        label: item.name,
      })),
      matchIds: resolveLocationMatchIds(selected[0]),
    });

    const dto = await withRefreshedAccessToken((token) =>
      createAlertApi(token, {
        name: buildAlertName(selected, propertyTypeEntry, input.transaction),
        filters,
      }),
    );

    return mapAlertDtoToPropertyAlert(dto);
  }

  async setEnabled(
    _userId: string,
    id: string,
    enabled: boolean,
  ): Promise<PropertyAlert | null> {
    void _userId;
    const dto = await withRefreshedAccessToken((token) =>
      updateAlertApi(token, id, { isActive: enabled }),
    );
    return mapAlertDtoToPropertyAlert(dto);
  }

  async remove(_userId: string, id: string): Promise<void> {
    void _userId;
    await withRefreshedAccessToken((token) => deleteAlertApi(token, id));
  }
}

let alertsService: AlertsService | null = null;

export function getAlertsService(): AlertsService {
  if (!alertsService) alertsService = new AlertsService();
  return alertsService;
}
