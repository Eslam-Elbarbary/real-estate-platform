import {
  createDeveloper,
  getDevelopers,
  updateDeveloper,
} from './repository';
import type {
  CreateDeveloperInput,
  Developer,
  DeveloperFilters,
  DeveloperListResult,
  UpdateDeveloperInput,
} from './types';

export async function getAdminDevelopers(
  filters: DeveloperFilters = {},
): Promise<DeveloperListResult> {
  return getDevelopers({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
  });
}

export async function createAdminDeveloper(
  data: CreateDeveloperInput,
): Promise<Developer> {
  return createDeveloper({
    slug: data.slug.trim(),
    nameEn: data.nameEn.trim(),
    nameAr: data.nameAr?.trim() || undefined,
    description: data.description?.trim() || undefined,
    logoUrl: data.logoUrl?.trim() || undefined,
    website: data.website?.trim() || undefined,
    isActive: data.isActive ?? true,
  });
}

export async function updateAdminDeveloper(
  id: string,
  data: UpdateDeveloperInput,
): Promise<Developer> {
  return updateDeveloper(id, {
    slug: data.slug?.trim(),
    nameEn: data.nameEn?.trim(),
    nameAr: data.nameAr === undefined ? undefined : data.nameAr?.trim() || null,
    description:
      data.description === undefined ? undefined : data.description?.trim() || null,
    logoUrl: data.logoUrl === undefined ? undefined : data.logoUrl?.trim() || null,
    website: data.website === undefined ? undefined : data.website?.trim() || null,
    isActive: data.isActive,
  });
}
