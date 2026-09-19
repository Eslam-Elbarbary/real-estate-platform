export interface Country {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
}

export interface City {
  id: string;
  countryId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
}

export interface Area {
  id: string;
  cityId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
}

export interface District {
  id: string;
  areaId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
}

export interface AreaTreeNode extends Area {
  districts: District[];
}

export interface CityTreeNode extends City {
  areas: AreaTreeNode[];
}

/** Matches NestJS CountryTreeNodeDto. */
export interface LocationTreeNode extends Country {
  cities: CityTreeNode[];
}

// ── Admin management (full CRUD, includes inactive rows) ─────────────────────

export interface AdminCountry {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCity {
  id: string;
  countryId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminArea {
  id: string;
  cityId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDistrict {
  id: string;
  areaId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryInput {
  code: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdateCountryInput {
  code?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}

export interface CreateCityInput {
  slug: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdateCityInput {
  slug?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}

export interface CreateAreaInput {
  slug: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdateAreaInput {
  slug?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}

export interface CreateDistrictInput {
  slug: string;
  nameEn: string;
  nameAr?: string;
  isActive?: boolean;
}

export interface UpdateDistrictInput {
  slug?: string;
  nameEn?: string;
  nameAr?: string | null;
  isActive?: boolean;
}
