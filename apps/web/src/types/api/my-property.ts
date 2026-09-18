/** Mirrors NestJS PropertyResponseDto for GET /api/v1/properties/me */

export type ApiPropertyStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'EXPIRED';

export type ApiRentPeriod = 'DAILY' | 'MONTHLY' | 'YEARLY';

export type ApiPaymentType = 'CASH' | 'INSTALLMENT' | 'CASH_OR_INSTALLMENT';

export interface MyPropertyDto {
  id: string;
  title: string | null;
  description: string | null;
  slug: string;
  status: ApiPropertyStatus;
  propertyTypeId: string | null;
  transactionTypeId: string | null;
  areaId: string | null;
  districtId: string | null;
  compoundId: string | null;
  legalStatusId?: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  floor: number | null;
  yearBuilt: number | null;
  furnished: boolean | null;
  finishingType?:
    | 'UNFINISHED'
    | 'SEMI_FINISHED'
    | 'FINISHED'
    | 'LUX'
    | 'SUPER_LUX'
    | null;
  rentPeriod: ApiRentPeriod | null;
  price: number | null;
  currency: string;
  paymentType?: ApiPaymentType | null;
  downPayment?: number | null;
  installmentYears?: number | null;
  monthlyInstallment?: number | null;
  publishedAt: string | null;
  submittedAt: string | null;
  archivedAt: string | null;
  /** Owner-visible rejection note (REJECTED only). */
  rejectedReason?: string | null;
  /** Cover image when available from list/detail. */
  primaryImageUrl?: string | null;
  location?: {
    country: {
      id: string;
      nameEn: string;
      nameAr: string | null;
      slug?: string | null;
    } | null;
    city: {
      id: string;
      nameEn: string;
      nameAr: string | null;
      slug?: string | null;
    } | null;
    area: {
      id: string;
      nameEn: string;
      nameAr: string | null;
      slug?: string | null;
    } | null;
    district: {
      id: string;
      nameEn: string;
      nameAr: string | null;
      slug?: string | null;
    } | null;
    compound: {
      id: string;
      nameEn: string;
      nameAr: string | null;
      slug?: string | null;
    } | null;
    summary: string;
  } | null;
  compound?: {
    id: string;
    nameEn: string;
    nameAr: string | null;
    slug?: string | null;
  } | null;
  propertyViews?: Array<{
    id: string;
    code?: string | null;
    nameEn: string;
    nameAr: string | null;
  }>;
  legalStatus?: {
    id: string;
    code?: string | null;
    nameEn: string;
    nameAr: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  /** Present only on some mutations (e.g. PUT features); not on GET /me/:id. */
  features?: Array<{
    id: string;
    code: string;
    nameEn: string;
    nameAr: string | null;
    category: string | null;
  }>;
}

/** GET /api/v1/properties/me/:id/media */
export interface PropertyImageDto {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
}

/** GET /api/v1/properties/me/:id/status-history — owner-safe (no admin identity). */
export interface OwnerPropertyStatusHistoryDto {
  id: string;
  fromStatus: ApiPropertyStatus | null;
  toStatus: ApiPropertyStatus;
  reason: string | null;
  createdAt: string;
}
