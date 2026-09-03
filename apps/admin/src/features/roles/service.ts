import {
  createRole,
  deleteRole,
  getPermissionsCatalog,
  getRoleDetails,
  getRoles,
  setRolePermissions,
  updateRole,
} from './repository';
import type {
  AdminPermissionCatalogItem,
  AdminRoleDetails,
  CreateRoleInput,
  RoleFilters,
  RoleListResult,
  SetRolePermissionsInput,
  UpdateRoleInput,
} from './types';

export async function getAdminRoles(
  filters: RoleFilters = {},
): Promise<RoleListResult> {
  return getRoles({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
  });
}

export async function getAdminRoleDetails(id: string): Promise<AdminRoleDetails> {
  return getRoleDetails(id);
}

export async function createAdminRole(
  input: CreateRoleInput,
): Promise<AdminRoleDetails> {
  return createRole({
    code: input.code.trim().toUpperCase(),
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    isAdmin: input.isAdmin,
    isSuperAdmin: input.isSuperAdmin,
    priority: input.priority,
  });
}

export async function updateAdminRole(
  id: string,
  input: UpdateRoleInput,
): Promise<AdminRoleDetails> {
  return updateRole(id, {
    name: input.name?.trim(),
    description:
      input.description !== undefined
        ? input.description.trim() || undefined
        : undefined,
    isAdmin: input.isAdmin,
    isSuperAdmin: input.isSuperAdmin,
    priority: input.priority,
  });
}

export async function deleteAdminRole(id: string): Promise<{ message: string }> {
  return deleteRole(id);
}

export async function setAdminRolePermissions(
  id: string,
  input: SetRolePermissionsInput,
): Promise<AdminRoleDetails> {
  return setRolePermissions(id, {
    permissionCodes: [...new Set(input.permissionCodes.map((code) => code.trim()))],
  });
}

export async function getAdminPermissionsCatalog(): Promise<
  AdminPermissionCatalogItem[]
> {
  return getPermissionsCatalog();
}
