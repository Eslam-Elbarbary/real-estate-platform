import type { PropertyType, TransactionType } from '@/types';

export type NeighborhoodLevel =
  | 'region'
  | 'city'
  | 'district'
  | 'area'
  | 'subarea';

export interface NeighborhoodBreadcrumbItem {
  label: string;
  href: string;
}

export interface NeighborhoodPropertyPrice {
  propertyType: PropertyType;
  salePricePerSqm?: number;
  rentPricePerSqm?: number;
  yearlyChangePercent?: number;
  sampleSize?: number;
}

export interface NeighborhoodAnnualChange {
  valuePercent: number;
  periodLabel: string;
  /** Property type this statistic focuses on */
  propertyType?: PropertyType;
}

export interface NeighborhoodRatings {
  overall?: number;
  safety?: number;
  services?: number;
  transportation?: number;
  lifestyle?: number;
  shopping?: number;
  quietness?: number;
}

export interface NeighborhoodChildSummary {
  id: string;
  slug: string;
  pathSegments: string[];
  nameAr: string;
  image: string;
  averageSalePricePerSqm?: number;
  averageRentPricePerSqm?: number;
}

export interface NeighborhoodBroker {
  id: string;
  name: string;
  logo?: string;
  listingCount?: number;
  verified?: boolean;
}

export interface NeighborhoodFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface NeighborhoodPropertyLink {
  label: string;
  transaction: TransactionType;
  propertyType?: PropertyType;
  href: string;
  count?: number;
}

export interface NeighborhoodSeo {
  title: string;
  description: string;
}

export interface Neighborhood {
  id: string;
  slug: string;
  pathSegments: string[];
  nameAr: string;
  nameEn?: string;
  level: NeighborhoodLevel;
  parentId?: string;
  breadcrumb: NeighborhoodBreadcrumbItem[];
  heroImage?: string;
  cardImage?: string;
  coverImage?: string;
  shortDescription?: string;
  description?: string;
  priceStats: NeighborhoodPropertyPrice[];
  annualChange?: NeighborhoodAnnualChange;
  ratings?: NeighborhoodRatings;
  children?: NeighborhoodChildSummary[];
  brokers?: NeighborhoodBroker[];
  faq?: NeighborhoodFaqItem[];
  relatedPropertyLinks?: NeighborhoodPropertyLink[];
  popularLinks?: NeighborhoodPropertyLink[];
  seo?: NeighborhoodSeo;
  /** Show on main directory popular grid */
  featuredOnDirectory?: boolean;
  directoryOrder?: number;
}

export interface NeighborhoodDirectoryView {
  popular: NeighborhoodChildSummary[];
  cityLinks: NeighborhoodPropertyLink[];
}

export interface NeighborhoodDetailsView {
  neighborhood: Neighborhood;
  children: NeighborhoodChildSummary[];
}
