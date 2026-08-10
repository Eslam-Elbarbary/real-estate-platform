import type { PropertyType, TransactionType } from '@/types';

/** Marketplace listing management status — distinct from valuation PropertyPortfolio. */
export type ManagedListingStatus =
  | 'published'
  | 'rejected'
  | 'expired'
  | 'pending'
  | 'deleted'
  | 'draft';

export type ManagedListingSort =
  | 'newest'
  | 'oldest'
  | 'most_viewed'
  | 'most_contacted';

export interface ManagedListing {
  id: string;
  slug: string;
  title: string;
  image?: string;
  transaction: TransactionType;
  propertyType: PropertyType;
  locationLabel: string;
  priceEgp?: number;
  status: ManagedListingStatus;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  searchAppearances?: number;
  contacts?: number;
  rejectionReason?: string;
  expiresAt?: string;
  /** Present when row comes from Add Property ListingDraft. */
  draftStep?:
    | 'basic'
    | 'details'
    | 'price'
    | 'description'
    | 'media'
    | 'publish';
}

export interface ManagedListingStatusCounts {
  published: number;
  rejected: number;
  expired: number;
  pending: number;
  deleted: number;
  draft: number;
  all: number;
}

export interface EngagementSummary {
  totalSearchAppearances: number | null;
  totalViews: number | null;
  totalContacts: number | null;
  averageViewRate: number | null;
  averageContactRate: number | null;
  averageContactCost: number | null;
}

export interface ManagedListingSearchFilters {
  userId: string;
  status: ManagedListingStatus;
  query?: string;
  sort: ManagedListingSort;
  page: number;
  pageSize: number;
}

export interface ManagedListingSearchResult {
  items: ManagedListing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
