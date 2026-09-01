'use server';

import { getUserFacingErrorMessage } from '@/lib/errors';
import {
  approveAdminProperty,
  archiveAdminProperty,
  createAdminProperty,
  rejectAdminProperty,
  updateAdminProperty,
} from './service';
import type { CreatePropertyInput, UpdatePropertyInput } from './types';

export type PropertyActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createPropertyAction(
  data: CreatePropertyInput,
): Promise<PropertyActionResult> {
  try {
    await createAdminProperty(data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updatePropertyAction(
  id: string,
  data: UpdatePropertyInput,
): Promise<PropertyActionResult> {
  try {
    await updateAdminProperty(id, data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

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
