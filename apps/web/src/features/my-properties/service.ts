import 'server-only';

import { fetchMyProperties } from '@/data/repositories/api-my-properties';
import { withRefreshedAccessToken } from '@/features/auth/session';
import {
  fetchPropertyTypes,
  fetchTransactionTypes,
} from '@/features/properties/api/catalogs';
import type { ApiPropertyStatus } from '@/types/api/my-property';
import { getPropertyManagementRepository } from './repository';
import {
  mapMyPropertyToManagedListing,
  toApiPropertyStatus,
} from './mappers/to-managed-listing';
import type {
  EngagementSummary,
  ManagedListing,
  ManagedListingSearchFilters,
  ManagedListingSearchResult,
  ManagedListingStatusCounts,
} from './types';

function matchesQuery(item: ManagedListing, query: string): boolean {
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return (
    item.title.toLowerCase().includes(needle) ||
    item.id.toLowerCase().includes(needle) ||
    item.locationLabel.toLowerCase().includes(needle)
  );
}

function sortListings(
  items: ManagedListing[],
  sort: ManagedListingSearchFilters['sort'],
): ManagedListing[] {
  const next = [...items];
  switch (sort) {
    case 'oldest':
      return next.sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
      );
    case 'most_viewed':
      // views not in /properties/me — fall back to newest
      return next.sort(
        (a, b) => Date.parse(b.updatedAt ?? b.createdAt) - Date.parse(a.updatedAt ?? a.createdAt),
      );
    case 'most_contacted':
      return next.sort(
        (a, b) => Date.parse(b.updatedAt ?? b.createdAt) - Date.parse(a.updatedAt ?? a.createdAt),
      );
    case 'newest':
    default:
      return next.sort(
        (a, b) => Date.parse(b.updatedAt ?? b.createdAt) - Date.parse(a.updatedAt ?? a.createdAt),
      );
  }
}

async function loadCatalogs() {
  const [propertyTypes, transactionTypes] = await Promise.all([
    fetchPropertyTypes().catch(() => []),
    fetchTransactionTypes().catch(() => []),
  ]);
  return { propertyTypes, transactionTypes };
}

async function fetchMapped(
  statuses?: ApiPropertyStatus | ApiPropertyStatus[],
): Promise<ManagedListing[]> {
  const catalogs = await loadCatalogs();

  return withRefreshedAccessToken(async (token) => {
    if (!statuses) {
      const rows = await fetchMyProperties(token);
      return rows.map((row) => mapMyPropertyToManagedListing(row, catalogs));
    }

    const list = Array.isArray(statuses) ? statuses : [statuses];
    const batches = await Promise.all(
      list.map((status) => fetchMyProperties(token, status)),
    );
    const byId = new Map<string, ManagedListing>();
    for (const rows of batches) {
      for (const row of rows) {
        byId.set(row.id, mapMyPropertyToManagedListing(row, catalogs));
      }
    }
    return Array.from(byId.values());
  });
}

export class PropertyManagementService {
  constructor(
    private readonly repository = getPropertyManagementRepository(),
  ) {}

  async searchListings(
    filters: ManagedListingSearchFilters,
  ): Promise<ManagedListingSearchResult> {
    const apiStatus = toApiPropertyStatus(filters.status);
    let items = await fetchMapped(apiStatus);

    items = items.filter((item) => matchesQuery(item, filters.query ?? ''));
    items = sortListings(items, filters.sort);

    const total = items.length;
    const totalPages =
      total === 0 ? 0 : Math.max(1, Math.ceil(total / filters.pageSize));
    const page =
      totalPages === 0 ? 1 : Math.min(filters.page, totalPages);
    const start = (page - 1) * filters.pageSize;

    return {
      items: items.slice(start, start + filters.pageSize),
      total,
      page,
      pageSize: filters.pageSize,
      totalPages,
    };
  }

  async getStatusCounts(_userId: string): Promise<ManagedListingStatusCounts> {
    void _userId;
    const items = await fetchMapped();
    const counts: ManagedListingStatusCounts = {
      published: 0,
      rejected: 0,
      expired: 0,
      pending: 0,
      deleted: 0,
      draft: 0,
      all: items.length,
    };

    for (const item of items) {
      counts[item.status] += 1;
    }

    return counts;
  }

  async getEngagementSummary(_userId: string): Promise<EngagementSummary> {
    void _userId;
    // No engagement aggregate endpoint on /properties/me
    return {
      totalSearchAppearances: null,
      totalViews: null,
      totalContacts: null,
      averageViewRate: null,
      averageContactRate: null,
      averageContactCost: null,
    };
  }

  /** Legacy demo overlay lookup (not used by real My Properties API list). */
  getById(id: string): Promise<ManagedListing | null> {
    return this.repository.getById(id);
  }

  /** Legacy demo overlay write (kept for unrelated demos; not used by submission). */
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
