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
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  floor: number | null;
  yearBuilt: number | null;
  furnished: boolean | null;
  rentPeriod: ApiRentPeriod | null;
  price: number | null;
  currency: string;
  publishedAt: string | null;
  submittedAt: string | null;
  archivedAt: string | null;
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
