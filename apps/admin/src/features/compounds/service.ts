import {
  createCompound,
  getCompound,
  getCompounds,
  updateCompound,
} from './repository';
import type {
  Compound,
  CompoundDetails,
  CompoundFilters,
  CompoundListResult,
  CreateCompoundInput,
  UpdateCompoundInput,
} from './types';

export async function getAdminCompounds(
  filters: CompoundFilters = {},
): Promise<CompoundListResult> {
  return getCompounds({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    developerId: filters.developerId?.trim() || undefined,
    areaId: filters.areaId?.trim() || undefined,
    isActive: filters.isActive,
  });
}

export async function getAdminCompoundDetails(
  id: string,
): Promise<CompoundDetails> {
  return getCompound(id);
}

export async function createAdminCompound(
  input: CreateCompoundInput,
): Promise<Compound> {
  return createCompound({
    slug: input.slug.trim(),
    areaId: input.areaId.trim(),
    nameEn: input.nameEn.trim(),
    nameAr: input.nameAr?.trim() || undefined,
    description: input.description?.trim() || undefined,
    developerId: input.developerId?.trim() || undefined,
    latitude: input.latitude,
    longitude: input.longitude,
    coverUrl: input.coverUrl?.trim() || undefined,
    coverPublicId: input.coverPublicId?.trim() || undefined,
    isActive: input.isActive ?? true,
  });
}

export async function updateAdminCompound(
  id: string,
  input: UpdateCompoundInput,
): Promise<Compound> {
  return updateCompound(id, {
    slug: input.slug?.trim(),
    areaId: input.areaId?.trim(),
    nameEn: input.nameEn?.trim(),
    nameAr: input.nameAr === undefined ? undefined : input.nameAr?.trim() || null,
    description:
      input.description === undefined ? undefined : input.description?.trim() || null,
    developerId:
      input.developerId === undefined
        ? undefined
        : input.developerId?.trim() || null,
    latitude: input.latitude,
    longitude: input.longitude,
    coverUrl: input.coverUrl === undefined ? undefined : input.coverUrl?.trim() || null,
    coverPublicId:
      input.coverPublicId === undefined
        ? undefined
        : input.coverPublicId?.trim() || null,
    isActive: input.isActive,
  });
}
