export type GeoPoint = {
  lat: number;
  lng: number;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type MapCluster = {
  id: string;
  center: GeoPoint;
  propertyIds: string[];
  count: number;
};

export type MapInteractionSource =
  | 'initial'
  | 'list-scroll'
  | 'marker'
  | 'cluster'
  | 'user';

export type SearchViewMode = 'list' | 'map';
