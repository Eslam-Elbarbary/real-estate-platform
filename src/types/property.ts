export type TransactionType = 'sale' | 'rent';

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'townhouse'
  | 'duplex'
  | 'penthouse'
  | 'studio'
  | 'chalet'
  | 'office'
  | 'shop'
  | 'land';

export type FinishingType =
  | 'unfinished'
  | 'semi_finished'
  | 'finished'
  | 'lux'
  | 'super_lux';

export type PaymentType = 'cash' | 'installment' | 'cash_or_installment';

export type VerificationState = 'unverified' | 'pending' | 'verified';

export type CurrencyCode = 'EGP';

export type ListingSource = 'developer' | 'broker' | 'owner';

export type PricingPeriod = 'one_time' | 'monthly' | 'daily' | 'yearly';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
  order: number;
  width?: number;
  height?: number;
}

/** Alias used by gallery UI; same shape as PropertyImage. */
export type PropertyGalleryImage = PropertyImage;

export interface PropertyLocation {
  countrySlug: string;
  countryName: string;
  governorateSlug: string;
  governorateName: string;
  citySlug: string;
  cityName: string;
  areaSlug: string;
  areaName: string;
  neighborhoodSlug?: string;
  neighborhoodName?: string;
  addressLine?: string;
  latitude: number;
  longitude: number;
}

export interface PropertySeller {
  id: string;
  name: string;
  type: 'owner' | 'broker' | 'agency' | 'developer';
  phone: string;
  whatsapp?: string;
  avatarUrl?: string;
  isVerified: boolean;
  rating?: number;
  listingCount?: number;
}

export interface PropertyAmenity {
  id: string;
  label: string;
  iconKey?: string;
}

export interface PropertyPaymentPlan {
  totalPrice: number;
  downPayment: number;
  installmentYears: number;
  monthlyInstallment: number;
  currency: CurrencyCode;
}

export interface PropertyStatistic {
  searchAppearances?: number;
  views: number;
  favoritesCount: number;
  calls?: number;
  /** When true, UI may show a locked/Pro treatment. */
  locked?: boolean;
}

export interface PropertyRatingCategory {
  key: string;
  label: string;
  /** Score from 0–5. */
  score: number;
}

export interface PropertyCompoundRatings {
  overall: number;
  categories: PropertyRatingCategory[];
}

export interface Property {
  id: string;
  referenceNumber: string;
  slug: string;
  title: string;
  description: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  /** Who listed the unit: developer inventory vs advertiser. */
  listingSource?: ListingSource;
  price: number;
  pricePerSqm: number;
  currency: CurrencyCode;
  /** How price is charged; rent defaults to monthly. */
  pricingPeriod?: PricingPeriod;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  finishingType: FinishingType;
  paymentType: PaymentType;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
  deliveryYear?: number;
  /** Arabic label for view / orientation (إطلالة). */
  viewType?: string;
  gardenArea?: number;
  location: PropertyLocation;
  compoundId?: string;
  compoundSlug?: string;
  compoundName?: string;
  compoundDescription?: string;
  compoundRatings?: PropertyCompoundRatings;
  developerId?: string;
  developerName?: string;
  images: PropertyImage[];
  seller: PropertySeller;
  amenities: string[];
  features: string[];
  verificationState: VerificationState;
  views: number;
  favoritesCount: number;
  searchAppearances?: number;
  createdAt: string;
  updatedAt: string;
}

export type PropertySortOption =
  | 'recommended'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'area_desc'
  | 'area_asc';

export type FilterPaymentType =
  | 'cash'
  | 'installment'
  | 'remaining_installments';

export interface PropertySearchFilters {
  transactionType?: TransactionType;
  propertyType?: PropertyType;
  propertyTypes?: string[];
  locationSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  finishingType?: FinishingType;
  paymentType?: PaymentType;
  paymentTypes?: FilterPaymentType[];
  downPayment?: number;
  installmentYears?: number;
  views?: string[];
  insideCompound?: boolean;
  directOwner?: boolean;
  hasVideo?: boolean;
  aiRecommended?: boolean;
  keyword?: string;
  compoundSlug?: string;
  sellerId?: string;
  sort?: PropertySortOption;
  page?: number;
  pageSize?: number;
}

export interface PropertySearchResult {
  items: Property[];
  /** Count of available demo/API items used for pagination. */
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /**
   * Optional market-scale estimate for result-header display only.
   * Never used for pagination math.
   */
  marketEstimate?: number;
}
