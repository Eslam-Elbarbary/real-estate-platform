'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import {
  approveAdminProperty,
  archiveAdminProperty,
  rejectAdminProperty,
} from './service';

export type PropertyActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function approvePropertyAction(
  id: string,
): Promise<PropertyActionResult> {
  try {
    await approveAdminProperty(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function rejectPropertyAction(
  id: string,
  reason: string,
): Promise<PropertyActionResult> {
  try {
    await rejectAdminProperty(id, reason);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function archivePropertyAction(
  id: string,
): Promise<PropertyActionResult> {
  try {
    await archiveAdminProperty(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
