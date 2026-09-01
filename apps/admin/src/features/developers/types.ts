/** Matches NestJS AdminDeveloperDto. */
export interface Developer {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  description: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  compoundCount: number;
}

export interface DeveloperCompoundSummary {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  coverUrl: string | null;
  publishedPropertyCount: number;
}

export interface DeveloperDetails extends Developer {
  compounds: DeveloperCompoundSummary[];
}

export interface DeveloperFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DeveloperPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DeveloperListResult {
  items: Developer[];
  meta: DeveloperPaginationMeta;
}

export interface CreateDeveloperInput {
  slug: string;
  nameEn: string;
  nameAr?: string;
  description?: string;
  logoUrl?: string;
  logoPublicId?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdateDeveloperInput {
  slug?: string;
  nameEn?: string;
  nameAr?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  website?: string | null;
  isActive?: boolean;
}
