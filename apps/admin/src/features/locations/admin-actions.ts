'use server';

import { revalidatePath } from 'next/cache';
import { getUserFacingErrorMessage } from '@/lib/errors';
import {
  createAdminArea,
  createAdminCity,
  createAdminCountry,
  createAdminDistrict,
  deleteAdminDistrict,
  listAdminAreas,
  listAdminCities,
  listAdminCountries,
  listAdminDistricts,
  updateAdminArea,
  updateAdminCity,
  updateAdminCountry,
  updateAdminDistrict,
} from './admin-repository';
import type {
  CreateAreaInput,
  CreateCityInput,
  CreateCountryInput,
  CreateDistrictInput,
  UpdateAreaInput,
  UpdateCityInput,
  UpdateCountryInput,
  UpdateDistrictInput,
} from './types';

export type LocationActionResult = { ok: true } | { ok: false; error: string };

function revalidateLocations() {
  revalidatePath('/catalogs');
  revalidatePath('/catalogs/locations');
  revalidatePath('/compounds');
  revalidatePath('/properties');
  revalidatePath('/properties/create');
}

export async function listCountriesAction(search?: string) {
  try {
    const items = await listAdminCountries(search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createCountryAction(
  input: CreateCountryInput,
): Promise<LocationActionResult> {
  try {
    await createAdminCountry(input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateCountryAction(
  id: string,
  input: UpdateCountryInput,
): Promise<LocationActionResult> {
  try {
    await updateAdminCountry(id, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listCitiesAction(countryId: string, search?: string) {
  try {
    const items = await listAdminCities(countryId, search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createCityAction(
  countryId: string,
  input: CreateCityInput,
): Promise<LocationActionResult> {
  try {
    await createAdminCity(countryId, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateCityAction(
  id: string,
  input: UpdateCityInput,
): Promise<LocationActionResult> {
  try {
    await updateAdminCity(id, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listAreasAction(cityId: string, search?: string) {
  try {
    const items = await listAdminAreas(cityId, search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createAreaAction(
  cityId: string,
  input: CreateAreaInput,
): Promise<LocationActionResult> {
  try {
    await createAdminArea(cityId, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateAreaAction(
  id: string,
  input: UpdateAreaInput,
): Promise<LocationActionResult> {
  try {
    await updateAdminArea(id, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function listDistrictsAction(areaId: string, search?: string) {
  try {
    const items = await listAdminDistricts(areaId, search);
    return { ok: true as const, items };
  } catch (error) {
    return { ok: false as const, error: getUserFacingErrorMessage(error), items: [] };
  }
}

export async function createDistrictAction(
  areaId: string,
  input: CreateDistrictInput,
): Promise<LocationActionResult> {
  try {
    await createAdminDistrict(areaId, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateDistrictAction(
  id: string,
  input: UpdateDistrictInput,
): Promise<LocationActionResult> {
  try {
    await updateAdminDistrict(id, input);
    revalidateLocations();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deleteDistrictAction(
  id: string,
): Promise<LocationActionResult & { deleted?: boolean }> {
  try {
    const result = await deleteAdminDistrict(id);
    revalidateLocations();
    return { ok: true, deleted: result.deleted };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
