/** Matches NestJS AdminUserListItemDto. */
export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  /** Dynamic role codes from the API (not a fixed enum). */
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

/** Matches NestJS AdminUserDetailsDto. */
export interface AdminUserDetails extends AdminUser {
  updatedAt: string;
}

/** Matches NestJS AdminUserRoleDto. */
export interface AdminUserRole {
  id: string;
  code: string;
  name: string;
  isSystem: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  assignedAt: string;
}

export interface UserFilters {
  search?: string;
  /** Role code filter (`^[A-Z0-9_]+$`). */
  role?: string;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface AssignUserRoleInput {
  roleCode: string;
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
