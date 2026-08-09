import type { FinishingType, PropertyType } from '@/types';

export type ValuationGoal = 'owned-property' | 'price-inquiry';

export type ValuationView =
  | 'nile'
  | 'golf'
  | 'lake'
  | 'plaza'
  | 'club'
  | 'rear'
  | 'garden'
  | 'pool'
  | 'sea'
  | 'corner'
  | 'side_street'
  | 'main_street'
  | 'other';

export type ValuationFinishing = FinishingType | 'extra_super_lux';

export interface ValuationLocationRef {
  slug: string;
  name: string;
  citySlug?: string;
  governorateSlug?: string;
}

export interface ValuationRequest {
  goal: ValuationGoal;
  location: ValuationLocationRef;
  propertyType: PropertyType;
  view?: ValuationView;
  finishing?: ValuationFinishing;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  purchasePrice?: number;
  /** ISO month: YYYY-MM */
  purchaseDate?: string;
  currentOwnerEstimate?: number;
}

export interface ValuationPriceRange {
  min: number;
  max: number;
}

export interface ValuationResult {
  id: string;
  request: ValuationRequest;
  estimatedPrice: number;
  averagePricePerSquareMeter: number;
  confidenceScore: number;
  priceRange?: ValuationPriceRange;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyPortfolioItem {
  id: string;
  valuationId: string;
  locationLabel: string;
  propertyType: PropertyType;
  averagePricePerSquareMeter: number;
  estimatedPrice: number;
  updatedAt: string;
}

export type ValuationDashboardTab = 'valuations' | 'portfolio';
