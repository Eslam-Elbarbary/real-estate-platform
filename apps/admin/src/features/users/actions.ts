'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import type { AdminRole } from '@/features/roles/types';
import {
  assignAdminUserRole,
  getAdminUserRoles,
  getAssignableAdminRoles,
  removeAdminUserRole,
  selectAdminUsers,
  updateAdminUserStatus,
} from './service';
import type { AdminUserRole, AdminUserSelectItem } from './types';

export type UserActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type UserSelectActionResult =
  | { ok: true; items: AdminUserSelectItem[] }
  | { ok: false; error: string };

export type UserRolesActionResult =
  | { ok: true; data: AdminUserRole[] }
  | { ok: false; error: string };

export type UserRoleMutationResult =
  | { ok: true; data: AdminUserRole }
  | { ok: false; error: string };

export type AssignableRolesActionResult =
  | { ok: true; data: AdminRole[] }
  | { ok: false; error: string };

export async function selectUsersAction(
  search?: string,
  limit = 20,
): Promise<UserSelectActionResult> {
  try {
    const items = await selectAdminUsers(search, limit);
    return { ok: true, items };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateUserStatusAction(
  id: string,
  isActive: boolean,
): Promise<UserActionResult> {
  try {
    await updateAdminUserStatus(id, isActive);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listUserRolesAction(
  userId: string,
): Promise<UserRolesActionResult> {
  try {
    const data = await getAdminUserRoles(userId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listAssignableRolesAction(): Promise<AssignableRolesActionResult> {
  try {
    const data = await getAssignableAdminRoles();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function assignUserRoleAction(
  userId: string,
  roleCode: string,
): Promise<UserRoleMutationResult> {
  try {
    const data = await assignAdminUserRole(userId, roleCode);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function removeUserRoleAction(
  userId: string,
  roleCode: string,
): Promise<UserRoleMutationResult> {
  try {
    const data = await removeAdminUserRole(userId, roleCode);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
