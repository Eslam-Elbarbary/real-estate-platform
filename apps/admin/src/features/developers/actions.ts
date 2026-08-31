'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { createAdminDeveloper, updateAdminDeveloper } from './service';
import type { CreateDeveloperInput, UpdateDeveloperInput } from './types';

export type DeveloperActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createDeveloperAction(
  data: CreateDeveloperInput,
): Promise<DeveloperActionResult> {
  try {
    await createAdminDeveloper(data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateDeveloperAction(
  id: string,
  data: UpdateDeveloperInput,
): Promise<DeveloperActionResult> {
  try {
    await updateAdminDeveloper(id, data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
