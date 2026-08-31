'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { createAdminPlan, updateAdminPlan } from './service';
import type { CreatePlanInput, UpdatePlanInput } from './types';

export type PlanActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createPlanAction(
  data: CreatePlanInput,
): Promise<PlanActionResult> {
  try {
    await createAdminPlan(data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updatePlanAction(
  id: string,
  data: UpdatePlanInput,
): Promise<PlanActionResult> {
  try {
    await updateAdminPlan(id, data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
