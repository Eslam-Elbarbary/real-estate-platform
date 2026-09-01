import {
  approveProperty,
  archiveProperty,
  createProperty,
  fetchAdminProperties,
  getPropertyDetails,
  rejectProperty,
  updateProperty,
} from './repository';
import { fetchPropertyFormCatalogs } from './catalogs';
import type {
  AdminPropertiesFilters,
  AdminPropertiesListResult,
  AdminPropertyActionResult,
  AdminPropertyDetails,
  CreatePropertyInput,
  PropertyFormCatalogs,
  UpdatePropertyInput,
} from './types';

export async function getAdminProperties(
  filters: AdminPropertiesFilters = {},
): Promise<AdminPropertiesListResult> {
  return fetchAdminProperties({
    status: filters.status ?? 'PENDING_REVIEW',
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
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
