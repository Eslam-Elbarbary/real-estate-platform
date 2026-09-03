/** Matches NestJS AdminRoleListItemDto / AdminRoleDetailsDto. */
export interface AdminRole {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  priority: number;
  userCount: number;
  permissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRoleDetails extends AdminRole {
  permissions: string[];
}

/** Matches NestJS AdminPermissionDto. */
export interface AdminPermissionCatalogItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface RoleFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface RolePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleListResult {
  items: AdminRole[];
  meta: RolePaginationMeta;
}

export interface CreateRoleInput {
  code: string;
  name: string;
  description?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  priority?: number;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  priority?: number;
}

export interface SetRolePermissionsInput {
  permissionCodes: string[];
}
