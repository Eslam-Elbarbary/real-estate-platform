import {
  getUserDetails,
  getUsers,
  selectUsers,
  updateUserStatus,
} from './repository';
import type {
  AdminUserDetails,
  AdminUserSelectItem,
  UserFilters,
  UserListResult,
} from './types';

export async function getAdminUsers(
  filters: UserFilters = {},
): Promise<UserListResult> {
  return getUsers({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    role: filters.role,
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
