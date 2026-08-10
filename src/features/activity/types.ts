import type { PropertyType, TransactionType } from '@/types';

export interface FavoriteItem {
  id: string;
  propertyId: string;
  createdAt: string;
}

export interface UserNote {
  id: string;
  body: string;
  propertyId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UserNotificationType =
  | 'system'
  | 'listing'
  | 'alert'
  | 'promotion';

export interface UserNotification {
  id: string;
  type: UserNotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface PropertyAlertLocation {
  id: string;
  slug: string;
  label: string;
}

export interface PropertyAlert {
  id: string;
  locations: PropertyAlertLocation[];
  transaction: TransactionType;
  propertyType: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  enabled: boolean;
  createdAt: string;
}

export interface CreatePropertyAlertInput {
  locations: PropertyAlertLocation[];
  transaction: TransactionType;
  propertyType: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}
