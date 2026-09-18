'use server';

import { revalidatePath } from 'next/cache';
import { getUserFacingErrorMessage } from '@/lib/errors';
import {
  createAdminFeature,
  createAdminPropertyLegalStatus,
  createAdminPropertyType,
  createAdminPropertyView,
  createAdminTransactionType,
  listAdminFeatures,
  listAdminFinishingTypes,
  listAdminPropertyLegalStatuses,
  listAdminPropertyTypes,
  listAdminPropertyViews,
  listAdminTransactionTypes,
  updateAdminFeature,
  updateAdminPropertyLegalStatus,
  updateAdminPropertyType,
  updateAdminPropertyView,
  updateAdminTransactionType,
  deleteAdminFeature,
  deleteAdminPropertyLegalStatus,
  deleteAdminPropertyView,
} from './repository';
import type {
  CreateFeatureInput,
  CreatePropertyLegalStatusInput,
  CreatePropertyTypeInput,
  CreatePropertyViewInput,
  CreateTransactionTypeInput,
  UpdateFeatureInput,
  UpdatePropertyLegalStatusInput,
  UpdatePropertyTypeInput,
  UpdatePropertyViewInput,
  UpdateTransactionTypeInput,
} from './types';

export type CatalogActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateCatalogs() {
  revalidatePath('/catalogs');
  revalidatePath('/catalogs/property-types');
  revalidatePath('/catalogs/transaction-types');
  revalidatePath('/catalogs/features');
  revalidatePath('/catalogs/views');
  revalidatePath('/catalogs/legal-statuses');
  revalidatePath('/catalogs/finishing-types');
  revalidatePath('/features');
  revalidatePath('/properties');
  revalidatePath('/properties/create');
}

export async function listPropertyTypesAction(search?: string) {
  try {
    const items = await listAdminPropertyTypes(search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createPropertyTypeAction(
  input: CreatePropertyTypeInput,
): Promise<CatalogActionResult> {
  try {
    await createAdminPropertyType(input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updatePropertyTypeAction(
  id: string,
  input: UpdatePropertyTypeInput,
): Promise<CatalogActionResult> {
  try {
    await updateAdminPropertyType(id, input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listTransactionTypesAction(search?: string) {
  try {
    const items = await listAdminTransactionTypes(search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createTransactionTypeAction(
  input: CreateTransactionTypeInput,
): Promise<CatalogActionResult> {
  try {
    await createAdminTransactionType(input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateTransactionTypeAction(
  id: string,
  input: UpdateTransactionTypeInput,
): Promise<CatalogActionResult> {
  try {
    await updateAdminTransactionType(id, input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listFeaturesAction(filters?: {
  search?: string;
  category?: string;
}) {
  try {
    const items = await listAdminFeatures(filters);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createFeatureAction(
  input: CreateFeatureInput,
): Promise<CatalogActionResult> {
  try {
    await createAdminFeature(input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateFeatureAction(
  id: string,
  input: UpdateFeatureInput,
): Promise<CatalogActionResult> {
  try {
    await updateAdminFeature(id, input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deleteFeatureAction(
  id: string,
): Promise<CatalogActionResult & { deleted?: boolean }> {
  try {
    const result = await deleteAdminFeature(id);
    revalidateCatalogs();
    return { ok: true, deleted: result.deleted };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listPropertyViewsAction(search?: string) {
  try {
    const items = await listAdminPropertyViews(search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createPropertyViewAction(
  input: CreatePropertyViewInput,
): Promise<CatalogActionResult> {
  try {
    await createAdminPropertyView(input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updatePropertyViewAction(
  id: string,
  input: UpdatePropertyViewInput,
): Promise<CatalogActionResult> {
  try {
    await updateAdminPropertyView(id, input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deletePropertyViewAction(
  id: string,
): Promise<CatalogActionResult & { deleted?: boolean }> {
  try {
    const result = await deleteAdminPropertyView(id);
    revalidateCatalogs();
    return { ok: true, deleted: result.deleted };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listPropertyLegalStatusesAction(search?: string) {
  try {
    const items = await listAdminPropertyLegalStatuses(search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createPropertyLegalStatusAction(
  input: CreatePropertyLegalStatusInput,
): Promise<CatalogActionResult> {
  try {
    await createAdminPropertyLegalStatus(input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updatePropertyLegalStatusAction(
  id: string,
  input: UpdatePropertyLegalStatusInput,
): Promise<CatalogActionResult> {
  try {
    await updateAdminPropertyLegalStatus(id, input);
    revalidateCatalogs();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deletePropertyLegalStatusAction(
  id: string,
): Promise<CatalogActionResult & { deleted?: boolean }> {
  try {
    const result = await deleteAdminPropertyLegalStatus(id);
    revalidateCatalogs();
    return { ok: true, deleted: result.deleted };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listFinishingTypesAction() {
  try {
    const items = await listAdminFinishingTypes();
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}
