import type { PropertyStatus, SubscriptionStatus } from '@/types';

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

/** Matches NestJS AdminPropertyReviewCardDto. */
export interface Property {
  id: string;
  slug: string;
  title: string | null;
  price: number | null;
  currency: string;
  status: PropertyStatus;
  propertyType: PublicTypeRef | null;
  transactionType: PublicTypeRef | null;
  location: PublicLocationSummary;
  owner: AdminPropertyOwner;
  submittedAt: string | null;
  createdAt: string;
}

export interface AdminPropertiesFilters {
  status?: PropertyStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminPropertiesPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminPropertiesListResult {
  items: Property[];
  meta: AdminPropertiesPaginationMeta;
}

export interface AdminPropertyImage {
  url: string;
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
  status: PropertyStatus;
  price: number | null;
  currency: string;
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
