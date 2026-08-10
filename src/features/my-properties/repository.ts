import { cookies } from 'next/headers';
import { DEMO_MANAGED_LISTINGS } from './data/demo-listings';
import type {
  EngagementSummary,
  ManagedListing,
  ManagedListingSearchFilters,
  ManagedListingSearchResult,
  ManagedListingStatus,
  ManagedListingStatusCounts,
} from './types';

export const MANAGED_LISTINGS_OVERLAY_COOKIE = 'demo_managed_listings_overlay';

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
      return next.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    case 'most_contacted':
      return next.sort((a, b) => (b.contacts ?? 0) - (a.contacts ?? 0));
    case 'newest':
    default:
      return next.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      );
  }
}

function parseOverlay(raw: string | undefined): ManagedListing[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ManagedListing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface PropertyManagementRepository {
  search(filters: ManagedListingSearchFilters): Promise<ManagedListingSearchResult>;
  getStatusCounts(userId: string): Promise<ManagedListingStatusCounts>;
  getEngagementSummary(userId: string): Promise<EngagementSummary>;
  getById(id: string): Promise<ManagedListing | null>;
  upsertListing(listing: ManagedListing): Promise<ManagedListing>;
}

export class MockPropertyManagementRepository
  implements PropertyManagementRepository
{
  private async readOverlay(): Promise<ManagedListing[]> {
    const jar = await cookies();
    return parseOverlay(jar.get(MANAGED_LISTINGS_OVERLAY_COOKIE)?.value);
  }

  private async writeOverlay(items: ManagedListing[]): Promise<void> {
    const jar = await cookies();
    jar.set(MANAGED_LISTINGS_OVERLAY_COOKIE, JSON.stringify(items), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  private async allListings(): Promise<ManagedListing[]> {
    const overlay = await this.readOverlay();
    const byId = new Map<string, ManagedListing>();
    for (const item of DEMO_MANAGED_LISTINGS) byId.set(item.id, item);
    for (const item of overlay) byId.set(item.id, item);
    return Array.from(byId.values());
  }

  async search(
    filters: ManagedListingSearchFilters,
  ): Promise<ManagedListingSearchResult> {
    void filters.userId;
    const listings = await this.allListings();
    const filtered = listings.filter(
      (item) =>
        item.status === filters.status && matchesQuery(item, filters.query ?? ''),
    );
    const sorted = sortListings(filtered, filters.sort);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * filters.pageSize;

    return {
      items: sorted.slice(start, start + filters.pageSize),
      total,
      page,
      pageSize: filters.pageSize,
      totalPages,
    };
  }

  async getStatusCounts(_userId: string): Promise<ManagedListingStatusCounts> {
    void _userId;
    const listings = await this.allListings();
    const counts: ManagedListingStatusCounts = {
      published: 0,
      rejected: 0,
      expired: 0,
      pending: 0,
      deleted: 0,
      draft: 0,
      all: listings.length,
    };
    for (const item of listings) {
      counts[item.status] += 1;
    }
    return counts;
  }

  async getEngagementSummary(_userId: string): Promise<EngagementSummary> {
    void _userId;
    const listings = await this.allListings();
    const published = listings.filter((item) => item.status === 'published');
    if (published.length === 0) {
      return {
        totalSearchAppearances: null,
        totalViews: null,
        totalContacts: null,
        averageViewRate: null,
        averageContactRate: null,
        averageContactCost: null,
      };
    }

    const totalSearchAppearances = published.reduce(
      (sum, item) => sum + (item.searchAppearances ?? 0),
      0,
    );
    const totalViews = published.reduce((sum, item) => sum + (item.views ?? 0), 0);
    const totalContacts = published.reduce(
      (sum, item) => sum + (item.contacts ?? 0),
      0,
    );

    return {
      totalSearchAppearances,
      totalViews,
      totalContacts,
      averageViewRate:
        totalSearchAppearances > 0
          ? Number(((totalViews / totalSearchAppearances) * 100).toFixed(1))
          : null,
      averageContactRate:
        totalViews > 0
          ? Number(((totalContacts / totalViews) * 100).toFixed(1))
          : null,
      averageContactCost:
        totalContacts > 0 ? Math.round(18_000 / totalContacts) : null,
    };
  }

  async getById(id: string): Promise<ManagedListing | null> {
    return (await this.allListings()).find((item) => item.id === id) ?? null;
  }

  async upsertListing(listing: ManagedListing): Promise<ManagedListing> {
    const overlay = await this.readOverlay();
    const index = overlay.findIndex((item) => item.id === listing.id);
    if (index >= 0) overlay[index] = listing;
    else overlay.unshift(listing);
    await this.writeOverlay(overlay);
    return listing;
  }
}

let repository: PropertyManagementRepository | null = null;

export function getPropertyManagementRepository(): PropertyManagementRepository {
  if (!repository) {
    repository = new MockPropertyManagementRepository();
  }
  return repository;
}

export function emptyStatusCounts(): ManagedListingStatusCounts {
  return {
    published: 0,
    rejected: 0,
    expired: 0,
    pending: 0,
    deleted: 0,
    draft: 0,
    all: 0,
  };
}

export type { ManagedListingStatus };
