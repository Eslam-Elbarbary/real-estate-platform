'use server';

import { revalidatePath } from 'next/cache';
import { getAdminCompounds } from '@/features/compounds';
import { logPropertyCreateInDev } from '@/lib/dev/property-create-log';
import {
  getAdminErrorMessage,
  getUserFacingErrorMessage,
} from '@/lib/errors';
import {
  approveAdminProperty,
  archiveAdminProperty,
  attachAdminPropertyMedia,
  createAdminProperty,
  deleteAdminDraftProperty,
  deleteAdminPropertyMedia,
  listAdminPropertyMedia,
  publishAdminProperty,
  rejectAdminProperty,
  reorderAdminPropertyMedia,
  restoreAdminProperty,
  setPrimaryAdminPropertyMedia,
  unpublishAdminProperty,
  updateAdminProperty,
} from './service';
import type {
  AdminPropertyImage,
  AttachPropertyMediaInput,
  CreatePropertyInput,
  ReorderPropertyMediaInput,
  UpdatePropertyInput,
} from './types';

export type PropertyActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type CreatePropertyActionResult =
  | { ok: true; data: { id: string; status: string; title: string } }
  | { ok: false; error: string };

export type PropertyMediaActionResult =
  | { ok: true; data: AdminPropertyImage }
  | { ok: false; error: string };

export type PropertyMediaListActionResult =
  | { ok: true; data: AdminPropertyImage[] }
  | { ok: false; error: string };

export type CompoundSelectOption = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  developerName: string | null;
  locationLabel: string | null;
};

export type ListPropertyCompoundsResult =
  | { ok: true; items: CompoundSelectOption[] }
  | { ok: false; error: string };

function revalidatePropertyPaths(propertyId?: string) {
  revalidatePath('/properties');
  if (propertyId) {
    revalidatePath(`/properties/${propertyId}`);
  }
}

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

    revalidatePropertyPaths(created.id);

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
    // Prefer concrete DTO/validation messages over the generic VALIDATION toast.
    return { ok: false, error: getAdminErrorMessage(error) };
  }
}

export async function updatePropertyAction(
  id: string,
  data: UpdatePropertyInput,
): Promise<PropertyActionResult> {
  try {
    await updateAdminProperty(id, data);
    revalidatePropertyPaths(id);
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
    revalidatePropertyPaths(id);
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
    revalidatePropertyPaths(id);
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
    revalidatePropertyPaths(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function publishPropertyAction(
  id: string,
): Promise<PropertyActionResult> {
  try {
    await publishAdminProperty(id);
    revalidatePropertyPaths(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function unpublishPropertyAction(
  id: string,
): Promise<PropertyActionResult> {
  try {
    await unpublishAdminProperty(id);
    revalidatePropertyPaths(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function restorePropertyAction(
  id: string,
): Promise<PropertyActionResult> {
  try {
    await restoreAdminProperty(id);
    revalidatePropertyPaths(id);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deleteDraftPropertyAction(
  id: string,
): Promise<PropertyActionResult> {
  try {
    await deleteAdminDraftProperty(id);
    revalidatePropertyPaths();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listPropertyMediaAction(
  propertyId: string,
): Promise<PropertyMediaListActionResult> {
  try {
    const data = await listAdminPropertyMedia(propertyId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function attachPropertyMediaAction(
  propertyId: string,
  input: AttachPropertyMediaInput,
): Promise<PropertyMediaActionResult> {
  try {
    const data = await attachAdminPropertyMedia(propertyId, input);
    revalidatePropertyPaths(propertyId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function reorderPropertyMediaAction(
  propertyId: string,
  input: ReorderPropertyMediaInput,
): Promise<PropertyMediaListActionResult> {
  try {
    const data = await reorderAdminPropertyMedia(propertyId, input);
    revalidatePropertyPaths(propertyId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function setPrimaryPropertyMediaAction(
  propertyId: string,
  imageId: string,
): Promise<PropertyMediaActionResult> {
  try {
    const data = await setPrimaryAdminPropertyMedia(propertyId, imageId);
    revalidatePropertyPaths(propertyId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deletePropertyMediaAction(
  propertyId: string,
  imageId: string,
): Promise<PropertyActionResult> {
  try {
    await deleteAdminPropertyMedia(propertyId, imageId);
    revalidatePropertyPaths(propertyId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function upsertPropertyContactAction(
  propertyId: string,
  input: import('./api-property-contact').UpsertPropertyContactInput,
): Promise<
  | { ok: true; data: import('./api-property-contact').PropertyContactDto }
  | { ok: false; error: string }
> {
  try {
    const { updatePropertyContact } = await import('./api-property-contact');
    const data = await updatePropertyContact(propertyId, input);
    revalidatePropertyPaths(propertyId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function getPropertyContactAction(
  propertyId: string,
): Promise<
  | { ok: true; data: import('./api-property-contact').PropertyContactDto }
  | { ok: false; error: string }
> {
  try {
    const { getPropertyContact } = await import('./api-property-contact');
    const data = await getPropertyContact(propertyId);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

/** Active compounds for property form select (filtered by area when set). */
export async function listPropertyCompoundsAction(
  areaId?: string,
): Promise<ListPropertyCompoundsResult> {
  try {
    const result = await getAdminCompounds({
      areaId: areaId?.trim() || undefined,
      isActive: true,
      page: 1,
      limit: 50,
    });

    return {
      ok: true,
      items: result.items.map((compound) => {
        const developerName =
          compound.developer?.nameAr?.trim() ||
          compound.developer?.nameEn ||
          null;
        const locationParts = [
          compound.location?.area.nameAr || compound.location?.area.nameEn,
          compound.location?.city?.nameAr || compound.location?.city?.nameEn,
        ].filter(Boolean);
        return {
          id: compound.id,
          nameEn: compound.nameEn,
          nameAr: compound.nameAr,
          developerName,
          locationLabel: locationParts.join(' · ') || null,
        };
      }),
    };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
