'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import {
  createAdminRole,
  deleteAdminRole,
  getAdminPermissionsCatalog,
  getAdminRoleDetails,
  setAdminRolePermissions,
  updateAdminRole,
} from './service';
import type {
  AdminPermissionCatalogItem,
  AdminRoleDetails,
  CreateRoleInput,
  SetRolePermissionsInput,
  UpdateRoleInput,
} from './types';

export type RoleActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function createRoleAction(
  data: CreateRoleInput,
): Promise<RoleActionResult<AdminRoleDetails>> {
  try {
    const role = await createAdminRole(data);
    return { ok: true, data: role };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateRoleAction(
  id: string,
  data: UpdateRoleInput,
): Promise<RoleActionResult<AdminRoleDetails>> {
  try {
    const role = await updateAdminRole(id, data);
    return { ok: true, data: role };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deleteRoleAction(
  id: string,
): Promise<RoleActionResult<{ message: string }>> {
  try {
    const result = await deleteAdminRole(id);
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function getRoleDetailsAction(
  id: string,
): Promise<RoleActionResult<AdminRoleDetails>> {
  try {
    const role = await getAdminRoleDetails(id);
    return { ok: true, data: role };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function setRolePermissionsAction(
  id: string,
  data: SetRolePermissionsInput,
): Promise<RoleActionResult<AdminRoleDetails>> {
  try {
    const role = await setAdminRolePermissions(id, data);
    return { ok: true, data: role };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listPermissionsAction(): Promise<
  RoleActionResult<AdminPermissionCatalogItem[]>
> {
  try {
    const permissions = await getAdminPermissionsCatalog();
    return { ok: true, data: permissions };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
