import { getAdminRoles } from '@/features/roles/service';
import type { AdminRole } from '@/features/roles/types';
import {
  assignUserRole,
  getUserDetails,
  getUserRoles,
  getUsers,
  removeUserRole,
  selectUsers,
  updateUserStatus,
} from './repository';
import type {
  AdminUserDetails,
  AdminUserRole,
  AdminUserSelectItem,
  UserFilters,
  UserListResult,
} from './types';

const ROLE_CODE_PATTERN = /^[A-Z0-9_]+$/;

export async function getAdminUsers(
  filters: UserFilters = {},
): Promise<UserListResult> {
  const role = filters.role?.trim().toUpperCase();
  return getUsers({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    role: role && ROLE_CODE_PATTERN.test(role) ? role : undefined,
    status: filters.status,
  });
}

export async function getAdminUserDetails(
  id: string,
): Promise<AdminUserDetails> {
  return getUserDetails(id);
}

export async function updateAdminUserStatus(
  id: string,
  isActive: boolean,
): Promise<AdminUserDetails> {
  return updateUserStatus(id, isActive);
}

export async function selectAdminUsers(
  search?: string,
  limit = 20,
): Promise<AdminUserSelectItem[]> {
  return selectUsers(search, limit);
}

export async function getAdminUserRoles(
  userId: string,
): Promise<AdminUserRole[]> {
  return getUserRoles(userId);
}

export async function assignAdminUserRole(
  userId: string,
  roleCode: string,
): Promise<AdminUserRole> {
  return assignUserRole(userId, roleCode.trim().toUpperCase());
}

export async function removeAdminUserRole(
  userId: string,
  roleCode: string,
): Promise<AdminUserRole> {
  return removeUserRole(userId, roleCode.trim().toUpperCase());
}

/** Role catalog for assign/filter selectors (`GET /admin/roles`). */
export async function getAssignableAdminRoles(): Promise<AdminRole[]> {
  const result = await getAdminRoles({ page: 1, limit: 100 });
  return result.items;
}
