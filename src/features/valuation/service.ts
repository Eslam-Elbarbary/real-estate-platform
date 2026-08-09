import { getPropertyRepository } from '@/data/repositories/property-repository';
import type { Property } from '@/types';
import { getValuationRepository } from './repository';
import type {
  PropertyPortfolioItem,
  ValuationRequest,
  ValuationResult,
} from './types';

export class ValuationService {
  constructor(
    private readonly repository = getValuationRepository(),
    private readonly properties = getPropertyRepository(),
  ) {}

  listValuations(): Promise<ValuationResult[]> {
    return this.repository.listValuations();
  }

  listPortfolio(): Promise<PropertyPortfolioItem[]> {
    return this.repository.listPortfolio();
  }

  getById(id: string): Promise<ValuationResult | null> {
    return this.repository.findById(id);
  }

  create(request: ValuationRequest): Promise<ValuationResult> {
    return this.repository.createFromRequest(request);
  }

  async getRelatedListings(
    result: ValuationResult,
    limit = 6,
  ): Promise<Property[]> {
    const search = await this.properties.search({
      transactionType: 'sale',
      propertyType: result.request.propertyType,
      locationSlugs: [
        result.request.location.citySlug ?? result.request.location.slug,
      ].filter(Boolean),
      page: 1,
      pageSize: limit,
    });

    if (search.items.length >= 3) {
      return search.items.slice(0, limit);
    }

    const fallback = await this.properties.search({
      transactionType: 'sale',
      propertyType: result.request.propertyType,
      page: 1,
      pageSize: limit,
    });

    return fallback.items.slice(0, limit);
  }
}

let valuationService: ValuationService | null = null;

export function getValuationService(): ValuationService {
  if (!valuationService) {
    valuationService = new ValuationService();
  }
  return valuationService;
}
