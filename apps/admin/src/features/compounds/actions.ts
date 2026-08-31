'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { createAdminCompound, updateAdminCompound } from './service';
import type { CreateCompoundInput, UpdateCompoundInput } from './types';

export type CompoundActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createCompoundAction(
  data: CreateCompoundInput,
): Promise<CompoundActionResult> {
  try {
    await createAdminCompound(data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateCompoundAction(
  id: string,
  data: UpdateCompoundInput,
): Promise<CompoundActionResult> {
  try {
    await updateAdminCompound(id, data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
