import {
  approveProperty,
  archiveProperty,
  attachPropertyMedia,
  createProperty,
  deleteDraftProperty,
  deletePropertyMedia,
  fetchAdminProperties,
  getPropertyDetails,
  listPropertyMedia,
  publishProperty,
  rejectProperty,
  reorderPropertyMedia,
  restoreProperty,
  setPrimaryPropertyMedia,
  unpublishProperty,
  updateProperty,
} from './repository';
import { fetchPropertyFormCatalogs } from './catalogs';
import type {
  AdminPropertiesFilters,
  AdminPropertiesListResult,
  AdminPropertyActionResult,
  AdminPropertyDetails,
  AdminPropertyImage,
  AttachPropertyMediaInput,
  CreatePropertyInput,
  PropertyFormCatalogs,
  ReorderPropertyMediaInput,
  UpdatePropertyInput,
} from './types';

export async function getAdminProperties(
  filters: AdminPropertiesFilters = {},
): Promise<AdminPropertiesListResult> {
  return fetchAdminProperties({
    status: filters.status,
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    sort: filters.sort ?? 'newest',
  });
}

export async function getAdminPropertyDetails(
  id: string,
): Promise<AdminPropertyDetails> {
  return getPropertyDetails(id);
}

export async function approveAdminProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  return approveProperty(id);
}

export async function rejectAdminProperty(
  id: string,
  reason: string,
): Promise<AdminPropertyActionResult> {
  return rejectProperty(id, reason.trim());
}

export async function archiveAdminProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  return archiveProperty(id);
}

export async function publishAdminProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  return publishProperty(id);
}

export async function unpublishAdminProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  return unpublishProperty(id);
}

export async function restoreAdminProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  return restoreProperty(id);
}

export async function deleteAdminDraftProperty(
  id: string,
): Promise<{ message: string }> {
  return deleteDraftProperty(id);
}

export async function getPropertyFormCatalogs(): Promise<PropertyFormCatalogs> {
  return fetchPropertyFormCatalogs();
}

export async function createAdminProperty(
  input: CreatePropertyInput,
): Promise<AdminPropertyDetails> {
  return createProperty(input);
}

export async function updateAdminProperty(
  id: string,
  input: UpdatePropertyInput,
): Promise<AdminPropertyDetails> {
  return updateProperty(id, input);
}

export async function listAdminPropertyMedia(
  propertyId: string,
): Promise<AdminPropertyImage[]> {
  return listPropertyMedia(propertyId);
}

export async function attachAdminPropertyMedia(
  propertyId: string,
  input: AttachPropertyMediaInput,
): Promise<AdminPropertyImage> {
  return attachPropertyMedia(propertyId, input);
}

export async function reorderAdminPropertyMedia(
  propertyId: string,
  input: ReorderPropertyMediaInput,
): Promise<AdminPropertyImage[]> {
  return reorderPropertyMedia(propertyId, input);
}

export async function setPrimaryAdminPropertyMedia(
  propertyId: string,
  imageId: string,
): Promise<AdminPropertyImage> {
  return setPrimaryPropertyMedia(propertyId, imageId);
}

export async function deleteAdminPropertyMedia(
  propertyId: string,
  imageId: string,
): Promise<void> {
  return deletePropertyMedia(propertyId, imageId);
}
