'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { createAdminDeveloper, getAdminDevelopers, updateAdminDeveloper } from './service';
import type { CreateDeveloperInput, Developer, UpdateDeveloperInput } from './types';

export type DeveloperActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type DeveloperSearchActionResult =
  | { ok: true; items: Developer[] }
  | { ok: false; error: string };

export async function searchDevelopersAction(
  search?: string,
  limit = 20,
): Promise<DeveloperSearchActionResult> {
  try {
    const result = await getAdminDevelopers({
      search,
      limit,
      page: 1,
    });
    return { ok: true, items: result.items };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

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
