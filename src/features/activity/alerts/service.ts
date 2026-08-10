import { getLocationRepository } from '@/data/repositories';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { Location } from '@/types';
import { getAlertsRepository } from './repository';
import type { CreatePropertyAlertInput, PropertyAlert } from '../types';

export class AlertsService {
  constructor(
    private readonly repository = getAlertsRepository(),
    private readonly locations = getLocationRepository(),
  ) {}

  list(userId: string): Promise<PropertyAlert[]> {
    return this.repository.list(userId);
  }

  listLocationOptions(): Promise<Location[]> {
    return this.locations.findAll();
  }

  async create(
    userId: string,
    input: Omit<CreatePropertyAlertInput, 'locations'> & {
      locationSlugs: string[];
    },
  ): Promise<PropertyAlert> {
    const all = await this.locations.findAll();
    const locations = input.locationSlugs
      .map((slug) => all.find((item) => item.slug === slug))
      .filter((item): item is Location => Boolean(item))
      .map((item) => ({
        id: item.id,
        slug: item.slug,
        label: item.name,
      }));

    if (locations.length === 0) {
      throw new Error('LOCATION_REQUIRED');
    }

    return this.repository.create(userId, {
      locations,
      transaction: input.transaction,
      propertyType: input.propertyType,
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
      minArea: input.minArea,
      maxArea: input.maxArea,
    });
  }

  setEnabled(userId: string, id: string, enabled: boolean) {
    return this.repository.setEnabled(userId, id, enabled);
  }

  buildSearchHref(alert: PropertyAlert): string {
    const primary = alert.locations[0];
    return buildPropertySearchPath({
      transactionType: alert.transaction,
      propertyType: alert.propertyType,
      locationSlugs: primary ? [primary.slug] : undefined,
      minPrice: alert.minPrice,
      maxPrice: alert.maxPrice,
      minArea: alert.minArea,
      maxArea: alert.maxArea,
    });
  }
}

let alertsService: AlertsService | null = null;

export function getAlertsService(): AlertsService {
  if (!alertsService) alertsService = new AlertsService();
  return alertsService;
}
