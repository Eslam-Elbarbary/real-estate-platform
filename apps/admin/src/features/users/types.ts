import type { UserRole } from '@/types';

/** Matches NestJS AdminUserListItemDto. */
export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: UserRole[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

/** Matches NestJS AdminUserDetailsDto. */
export interface AdminUserDetails extends AdminUser {
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface UserPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResult {
  items: AdminUser[];
  meta: UserPaginationMeta;
}

/** Matches NestJS AdminUserSelectItemDto. */
export interface AdminUserSelectItem {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
}
