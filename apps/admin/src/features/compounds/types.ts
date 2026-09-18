/** Matches NestJS AdminCompoundDto (+ nested refs from listAdmin). */
export interface Compound {
  id: string;
  developerId: string | null;
  areaId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  coverUrl: string | null;
  coverPublicId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedPropertyCount: number;
  developer?: CompoundDeveloperSummary | null;
  location?: CompoundLocation;
}

export interface PublicNamedRef {
  id: string;
  nameEn: string;
  nameAr: string | null;
}

export interface CompoundDeveloperSummary {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  logoUrl: string | null;
}

export interface CompoundLocation {
  country: PublicNamedRef | null;
  city: PublicNamedRef | null;
  area: PublicNamedRef;
}

/** Matches NestJS AdminCompoundDetailsDto. */
export interface CompoundDetails extends Compound {
  developer: CompoundDeveloperSummary | null;
  location: CompoundLocation;
}

export interface CompoundFilters {
  search?: string;
  developerId?: string;
  areaId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CompoundPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CompoundListResult {
  items: Compound[];
  meta: CompoundPaginationMeta;
}

export interface CreateCompoundInput {
  slug: string;
  areaId: string;
  nameEn: string;
  nameAr?: string;
  description?: string;
  developerId?: string;
  latitude?: number;
  longitude?: number;
  coverUrl?: string;
  coverPublicId?: string;
  isActive?: boolean;
}

export interface UpdateCompoundInput {
  slug?: string;
  areaId?: string;
  nameEn?: string;
  nameAr?: string | null;
  description?: string | null;
  developerId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  coverUrl?: string | null;
  coverPublicId?: string | null;
  isActive?: boolean;
}
