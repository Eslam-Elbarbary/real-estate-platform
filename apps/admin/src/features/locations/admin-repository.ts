import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminArea,
  AdminCity,
  AdminCountry,
  AdminDistrict,
  CreateAreaInput,
  CreateCityInput,
  CreateCountryInput,
  CreateDistrictInput,
  UpdateAreaInput,
  UpdateCityInput,
  UpdateCountryInput,
  UpdateDistrictInput,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE = '/api/v1/admin/locations';

function unwrap<T>(response: ApiEnvelope<T>, fallback: string): T {
  if (!response.success || response.data == null) {
    throw createAdminError('UNKNOWN', {
      message: fallback,
      userMessage: fallback,
      details: response,
    });
  }
  return response.data;
}

export async function listAdminCountries(search?: string): Promise<AdminCountry[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminCountry[]>>(
    `${BASE}/countries${query}`,
  );
  return unwrap(response.data, 'تعذر تحميل قائمة الدول.');
}

export async function createAdminCountry(input: CreateCountryInput): Promise<AdminCountry> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminCountry>>(
    `${BASE}/countries`,
    input,
  );
  return unwrap(response.data, 'تعذر إنشاء الدولة.');
}

export async function updateAdminCountry(
  id: string,
  input: UpdateCountryInput,
): Promise<AdminCountry> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminCountry>>(
    `${BASE}/countries/${id}`,
    input,
  );
  return unwrap(response.data, 'تعذر تحديث الدولة.');
}

export async function listAdminCities(
  countryId: string,
  search?: string,
): Promise<AdminCity[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminCity[]>>(
    `${BASE}/countries/${countryId}/cities${query}`,
  );
  return unwrap(response.data, 'تعذر تحميل قائمة المدن.');
}

export async function createAdminCity(
  countryId: string,
  input: CreateCityInput,
): Promise<AdminCity> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminCity>>(
    `${BASE}/countries/${countryId}/cities`,
    input,
  );
  return unwrap(response.data, 'تعذر إنشاء المدينة.');
}

export async function updateAdminCity(id: string, input: UpdateCityInput): Promise<AdminCity> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminCity>>(
    `${BASE}/cities/${id}`,
    input,
  );
  return unwrap(response.data, 'تعذر تحديث المدينة.');
}

export async function listAdminAreas(cityId: string, search?: string): Promise<AdminArea[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminArea[]>>(
    `${BASE}/cities/${cityId}/areas${query}`,
  );
  return unwrap(response.data, 'تعذر تحميل قائمة المناطق.');
}

export async function createAdminArea(cityId: string, input: CreateAreaInput): Promise<AdminArea> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminArea>>(
    `${BASE}/cities/${cityId}/areas`,
    input,
  );
  return unwrap(response.data, 'تعذر إنشاء المنطقة.');
}

export async function updateAdminArea(id: string, input: UpdateAreaInput): Promise<AdminArea> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminArea>>(
    `${BASE}/areas/${id}`,
    input,
  );
  return unwrap(response.data, 'تعذر تحديث المنطقة.');
}

export async function listAdminDistricts(
  areaId: string,
  search?: string,
): Promise<AdminDistrict[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminDistrict[]>>(
    `${BASE}/areas/${areaId}/districts${query}`,
  );
  return unwrap(response.data, 'تعذر تحميل قائمة الأحياء.');
}

export async function createAdminDistrict(
  areaId: string,
  input: CreateDistrictInput,
): Promise<AdminDistrict> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminDistrict>>(
    `${BASE}/areas/${areaId}/districts`,
    input,
  );
  return unwrap(response.data, 'تعذر إنشاء الحي.');
}

export async function updateAdminDistrict(
  id: string,
  input: UpdateDistrictInput,
): Promise<AdminDistrict> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminDistrict>>(
    `${BASE}/districts/${id}`,
    input,
  );
  return unwrap(response.data, 'تعذر تحديث الحي.');
}

export async function deleteAdminDistrict(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  const response = await authenticatedApiClient.delete<
    ApiEnvelope<{ id: string; deleted: boolean }>
  >(`${BASE}/districts/${id}`);
  return unwrap(response.data, 'تعذر حذف الحي.');
}
