import type {
  FinishingType,
  PropertyType,
  TransactionType,
} from './property';

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  projectsCount?: number;
  memberSinceYear?: number;
  rating?: number;
  unitsForSale?: number;
  unitsForRent?: number;
}

export type CompoundPriceLevel = 'economy' | 'mid' | 'premium' | 'luxury';

export type CompoundConstructionStatus =
  | 'planning'
  | 'under_construction'
  | 'delivered'
  | 'ready';

export type CompoundPaymentMethod = 'cash' | 'installment' | 'cash_or_installment';

export type CompoundSortOption =
  | 'recommended'
  | 'newest'
  | 'price_low'
  | 'price_high';

/** Inventory channel for compound unit groups. */
export type CompoundUnitSource = 'developer' | 'advertiser';

/** URL-addressable compound units tab. */
export type CompoundUnitsView =
  | 'developer-sale'
  | 'advertiser-sale'
  | 'advertiser-rent';

/** Gallery image for Compound Details carousel. */
export interface CompoundGalleryImage {
  id: string;
  src: string;
  alt: string;
  order: number;
}

export interface CompoundImage {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
  order: number;
}

export interface CompoundRecommendation {
  score: number;
  label: string;
  summary: string;
  benefits?: string[];
  expertReviewAvailable?: boolean;
  pro?: boolean;
  ctaLabel?: string;
}

/** Thin link from a compound unit row to a Property listing. */
export interface CompoundUnitOption {
  id: string;
  propertyId: string;
}

export interface CompoundUnitGroup {
  id: string;
  propertyType: PropertyType;
  label: string;
  transactionType: TransactionType;
  source: CompoundUnitSource;
  units: CompoundUnitOption[];
}

export interface CompoundContentSection {
  heading?: string;
  paragraphs: string[];
  listItems?: string[];
}

export interface CompoundFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Compound {
  id: string;
  slug: string;
  /** Primary Arabic display name (homepage-compatible). */
  name: string;
  nameAr: string;
  nameEn?: string;
  description: string;
  shortDescription?: string;
  contentSections?: CompoundContentSection[];
  developerId: string;
  developerName: string;
  developerLogo?: string;
  developerProjectCount?: number;
  developer?: Developer;
  governorateSlug: string;
  governorateName: string;
  citySlug: string;
  cityName: string;
  areaSlug: string;
  areaName: string;
  /** Homepage-compatible cover URL. */
  coverImageUrl: string;
  images: CompoundImage[];
  gallery?: CompoundGalleryImage[];
  verified: boolean;
  startingPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  currency: 'EGP';
  priceLevel?: CompoundPriceLevel;
  constructionStatus?: CompoundConstructionStatus;
  finishingTypes?: FinishingType[];
  paymentMethods?: CompoundPaymentMethod[];
  availablePropertyTypes: PropertyType[];
  propertyCount: number;
  amenities: string[];
  phone?: string;
  whatsapp?: string;
  brochureUrl?: string;
  recommendation?: CompoundRecommendation;
  /**
   * Optional static groups. Prefer Property-backed inventory via
   * getCompoundUnitInventory — PropertyRepository is the source of truth.
   */
  unitGroups?: CompoundUnitGroup[];
  faq?: CompoundFaqItem[];
  latitude: number;
  longitude: number;
  isNew?: boolean;
  statusLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompoundSearchFilters {
  locationSlugs?: string[];
  propertyTypes?: PropertyType[];
  priceLevel?: CompoundPriceLevel;
  constructionStatus?: CompoundConstructionStatus;
  finishingTypes?: FinishingType[];
  paymentMethods?: CompoundPaymentMethod[];
  sort?: CompoundSortOption;
  page?: number;
  pageSize?: number;
}

export interface CompoundSearchAggregations {
  locations: Record<string, number>;
  propertyTypes: Record<string, number>;
  priceLevels: Record<string, number>;
  constructionStatuses: Record<string, number>;
  finishingTypes: Record<string, number>;
  paymentMethods: Record<string, number>;
}

export interface CompoundSearchResult {
  items: Compound[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** Display-scale estimate for directory title; pagination uses `total`. */
  marketEstimate?: number;
  aggregations: CompoundSearchAggregations;
}
