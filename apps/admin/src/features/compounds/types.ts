/** Matches NestJS AdminCompoundDto. */
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
  isActive?: boolean;
}
