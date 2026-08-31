'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { updateAdminUserStatus } from './service';

export type UserActionResult =
  | { ok: true }
  | { ok: false; error: string };

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
