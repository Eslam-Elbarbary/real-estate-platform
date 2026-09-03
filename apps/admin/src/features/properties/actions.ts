'use server';

import { revalidatePath } from 'next/cache';
import { logPropertyCreateInDev } from '@/lib/dev/property-create-log';
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

export type CreatePropertyActionResult =
  | { ok: true; data: { id: string; status: string; title: string } }
  | { ok: false; error: string };

export async function createPropertyAction(
  data: CreatePropertyInput,
): Promise<CreatePropertyActionResult> {
  logPropertyCreateInDev('action-start', {
    ownerId: data.ownerId,
    title: data.title,
    areaId: data.areaId,
    propertyTypeId: data.propertyTypeId,
    transactionTypeId: data.transactionTypeId,
    imageCount: data.images?.length ?? 0,
    featureCount: data.featureIds?.length ?? 0,
  });

  try {
    const created = await createAdminProperty(data);

    logPropertyCreateInDev('action-success', {
      id: created.id,
      status: created.status,
      title: created.title,
    });

    revalidatePath('/properties');

    return {
      ok: true,
      data: {
        id: created.id,
        status: created.status,
        title: created.title ?? data.title,
      },
    };
  } catch (error) {
    logPropertyCreateInDev('action-failure', {
      error: error instanceof Error ? error.message : String(error),
    });
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
