'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import { updateAdminLeadStatus } from './service';
import type { LeadStatus } from './types';

export type LeadActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus,
): Promise<LeadActionResult> {
  try {
    await updateAdminLeadStatus(id, status);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
