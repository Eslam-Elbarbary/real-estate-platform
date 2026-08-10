import { getPropertyManagementRepository } from './repository';
import type {
  EngagementSummary,
  ManagedListing,
  ManagedListingSearchFilters,
  ManagedListingSearchResult,
  ManagedListingStatusCounts,
} from './types';

export class PropertyManagementService {
  constructor(
    private readonly repository = getPropertyManagementRepository(),
  ) {}

  searchListings(
    filters: ManagedListingSearchFilters,
  ): Promise<ManagedListingSearchResult> {
    return this.repository.search(filters);
  }

  getStatusCounts(userId: string): Promise<ManagedListingStatusCounts> {
    return this.repository.getStatusCounts(userId);
  }

  getEngagementSummary(userId: string): Promise<EngagementSummary> {
    return this.repository.getEngagementSummary(userId);
  }

  getById(id: string): Promise<ManagedListing | null> {
    return this.repository.getById(id);
  }

  upsertListing(listing: ManagedListing): Promise<ManagedListing> {
    return this.repository.upsertListing(listing);
  }
}

let service: PropertyManagementService | null = null;

export function getPropertyManagementService(): PropertyManagementService {
  if (!service) {
    service = new PropertyManagementService();
  }
  return service;
}
