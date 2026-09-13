import type { PropertyStatus, SubscriptionStatus } from '@/types';

/** Aligned with apps/api Prisma PaymentType. */
export type PaymentType = 'CASH' | 'INSTALLMENT' | 'CASH_OR_INSTALLMENT';

/** Aligned with apps/api Prisma FinishingType. */
export type FinishingType =
  | 'UNFINISHED'
  | 'SEMI_FINISHED'
  | 'FINISHED'
  | 'LUX'
  | 'SUPER_LUX';

/** Aligned with apps/api Prisma RentPeriod. */
export type RentPeriod = 'MONTHLY' | 'YEARLY' | 'DAILY';

/** Aligned with apps/api Prisma MediaType. */
export type PropertyMediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';

/** Aligned with NestJS AdminPropertySort. */
export type AdminPropertySort =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc';

export interface PublicNamedRef {
  id: string;
  nameEn: string;
  nameAr: string | null;
}

export interface PublicTypeRef extends PublicNamedRef {
  code: string;
}

export interface PublicLocationSummary {
  country: PublicNamedRef | null;
  city: PublicNamedRef | null;
  area: PublicNamedRef | null;
  district: PublicNamedRef | null;
  summary: string;
}

export interface AdminPropertyOwner {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface PublicPrimaryImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

/** Matches NestJS AdminPropertyReviewCardDto. */
export interface Property {
  id: string;
  slug: string;
  title: string | null;
  referenceNumber: string | null;
  price: number | null;
  currency: string;
  status: PropertyStatus;
  paymentType: PaymentType | null;
  finishingType: FinishingType | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  propertyType: PublicTypeRef | null;
  transactionType: PublicTypeRef | null;
  location: PublicLocationSummary;
  compound: PublicNamedRef | null;
  owner: AdminPropertyOwner;
  primaryImage: PublicPrimaryImage | null;
  imageCount: number;
  videoCount: number;
  viewCount: number;
  favoritesCount: number;
  submittedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPropertiesFilters {
  status?: PropertyStatus;
  page?: number;
  limit?: number;
  search?: string;
  sort?: AdminPropertySort;
}

export interface AdminPropertyStatusCounts {
  ALL: number;
  DRAFT: number;
  PENDING_REVIEW: number;
  PENDING_PAYMENT: number;
  PUBLISHED: number;
  REJECTED: number;
  ARCHIVED: number;
  EXPIRED: number;
}

export interface AdminPropertiesPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  counts: AdminPropertyStatusCounts;
}

export interface AdminPropertiesListResult {
  items: Property[];
  meta: AdminPropertiesPaginationMeta;
}

/** Matches NestJS AdminPropertyImageDto. */
export interface AdminPropertyImage {
  id: string;
  mediaAssetId: string;
  url: string;
  type: PropertyMediaType;
  sortOrder: number;
  isPrimary: boolean;
}

export interface AdminPropertyFeature {
  id: string;
  nameEn: string;
  nameAr: string | null;
}

export interface AdminPropertyPlan {
  id: string;
  name: string;
  code: string;
  price: number;
  durationDays: number;
  features: unknown;
  status: string;
}

export interface AdminPropertySubscription {
  id: string;
  plan: AdminPropertyPlan;
  status: SubscriptionStatus;
  price: number;
  duration: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  nextAction?: 'pay' | 'await_review';
}

export interface AdminPropertyPaymentSummary {
  total: number;
  successful: number;
  pending: number;
  failed: number;
  totalPaid: number;
}

export interface AdminPropertyStatusHistoryEntry {
  id: string;
  fromStatus: PropertyStatus | null;
  toStatus: PropertyStatus;
  reason: string | null;
  changedById: string | null;
  changedByName: string | null;
  createdAt: string;
}

/** Matches NestJS AdminPropertyReviewDetailsDto. */
export interface AdminPropertyDetails {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  referenceNumber: string | null;
  status: PropertyStatus;
  price: number | null;
  pricePerSqm: number | null;
  currency: string;
  paymentType: PaymentType | null;
  downPayment: number | null;
  installmentYears: number | null;
  monthlyInstallment: number | null;
  finishingType: FinishingType | null;
  rentPeriod: RentPeriod | null;
  furnished: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  floor: number | null;
  yearBuilt: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  propertyType: PublicTypeRef | null;
  transactionType: PublicTypeRef | null;
  location: PublicLocationSummary;
  compound: PublicNamedRef | null;
  developer: PublicNamedRef | null;
  viewCount: number;
  favoritesCount: number;
  owner: AdminPropertyOwner;
  images: AdminPropertyImage[];
  features: AdminPropertyFeature[];
  subscriptions: AdminPropertySubscription[];
  paymentSummary: AdminPropertyPaymentSummary;
  statusHistory: AdminPropertyStatusHistoryEntry[];
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedById: string | null;
  reviewedByName: string | null;
  rejectedReason: string | null;
  archivedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Matches public catalogs API property type item. */
export interface CatalogPropertyType {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
}

/** Matches public catalogs API transaction type item. */
export interface CatalogTransactionType {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
}

/** Matches public catalogs API feature item. */
export interface CatalogFeature {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  category: string | null;
}

export interface PropertyFormCatalogs {
  propertyTypes: CatalogPropertyType[];
  transactionTypes: CatalogTransactionType[];
  features: CatalogFeature[];
}

export interface PropertyImageInput {
  mediaAssetId: string;
  sortOrder: number;
  isPrimary: boolean;
  type?: PropertyMediaType;
}

export interface AttachPropertyMediaInput {
  mediaAssetId: string;
  type?: PropertyMediaType;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ReorderPropertyMediaInput {
  images: Array<{ id: string; sortOrder: number }>;
}

export interface CreatePropertyInput {
  ownerId: string;
  title: string;
  description?: string;
  propertyTypeId: string;
  transactionTypeId: string;
  price: number;
  currency?: string;
  referenceNumber?: string;
  paymentType?: PaymentType;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
  finishingType?: FinishingType;
  rentPeriod?: RentPeriod;
  furnished?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  floor?: number;
  yearBuilt?: number;
  countryId?: string;
  cityId?: string;
  areaId: string;
  districtId?: string;
  compoundId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  featureIds?: string[];
  images?: PropertyImageInput[];
}

export interface UpdatePropertyInput {
  title?: string;
  description?: string | null;
  propertyTypeId?: string;
  transactionTypeId?: string;
  price?: number;
  currency?: string;
  referenceNumber?: string | null;
  paymentType?: PaymentType | null;
  downPayment?: number | null;
  installmentYears?: number | null;
  monthlyInstallment?: number | null;
  finishingType?: FinishingType | null;
  rentPeriod?: RentPeriod | null;
  furnished?: boolean | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  countryId?: string;
  cityId?: string;
  areaId?: string;
  districtId?: string | null;
  compoundId?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  featureIds?: string[];
}

/** Matches NestJS admin property action response payload. */
export interface AdminPropertyActionResult {
  id: string;
  slug: string;
  title: string | null;
  status: PropertyStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  rejectedReason: string | null;
}
