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
