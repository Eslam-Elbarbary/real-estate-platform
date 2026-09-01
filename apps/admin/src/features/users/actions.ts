'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { selectAdminUsers, updateAdminUserStatus } from './service';
import type { AdminUserSelectItem } from './types';

export type UserActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type UserSelectActionResult =
  | { ok: true; items: AdminUserSelectItem[] }
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
