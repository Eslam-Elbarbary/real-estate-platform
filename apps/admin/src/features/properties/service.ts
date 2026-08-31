import {
  approveProperty,
  archiveProperty,
  fetchAdminProperties,
  getPropertyDetails,
  rejectProperty,
} from './repository';
import type {
  AdminPropertiesFilters,
  AdminPropertiesListResult,
  AdminPropertyActionResult,
  AdminPropertyDetails,
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
