export interface AdminCatalogPropertyType {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogTransactionType {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogFeature {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogPropertyView {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogPropertyLegalStatus {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogFinishingType {
  code: string;
  nameEn: string;
  nameAr: string;
}

export interface CreatePropertyTypeInput {
  code: string;
  nameEn: string;
  nameAr?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdatePropertyTypeInput {
  code?: string;
  nameEn?: string;
  nameAr?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateTransactionTypeInput {
  code: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdateTransactionTypeInput {
  code?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}

export interface CreateFeatureInput {
  code: string;
  nameEn: string;
  nameAr?: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateFeatureInput {
  code?: string;
  nameEn?: string;
  nameAr?: string | null;
  category?: string | null;
  isActive?: boolean;
}

export interface CreatePropertyViewInput {
  code: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdatePropertyViewInput {
  code?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}

export interface CreatePropertyLegalStatusInput {
  code: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdatePropertyLegalStatusInput {
  code?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}
