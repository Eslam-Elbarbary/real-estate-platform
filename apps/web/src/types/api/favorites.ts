import type {
  PublicLocationSummary,
  PublicPrimaryImage,
} from './public-property';

/** Slim property card nested in favorite list/add responses. */
export interface FavoritePropertyDto {
  id: string;
  slug: string;
  title: string | null;
  price: number | null;
  currency: string;
  primaryImage: PublicPrimaryImage | null;
  location: PublicLocationSummary;
}

/** Mirrors NestJS FavoriteResponseDto. `id` is the property id. */
export interface FavoriteResponseDto {
  id: string;
  createdAt: string;
  property: FavoritePropertyDto;
}

/** Mirrors NestJS FavoriteCheckDto. */
export interface FavoriteCheckDto {
  isFavorite: boolean;
}

export interface FavoriteRemoveDto {
  message: string;
}
