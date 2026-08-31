import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type { Area, City, Country, District, LocationTreeNode } from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const LOCATIONS_PATH = '/api/v1/locations';

function parseListResponse<T>(
  response: ApiEnvelope<T[]>,
  userMessage: string,
): T[] {
  if (!response.success || !Array.isArray(response.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid locations list response',
      userMessage,
      details: response,
    });
  }

  return response.data;
}

export async function getCountries(): Promise<Country[]> {
  const response = await apiClient.get<ApiEnvelope<Country[]>>(
    `${LOCATIONS_PATH}/countries`,
  );

  return parseListResponse(response.data, 'تعذر تحميل قائمة الدول.');
}

export async function getCities(countryId: string): Promise<City[]> {
  const response = await apiClient.get<ApiEnvelope<City[]>>(
    `${LOCATIONS_PATH}/countries/${countryId}/cities`,
  );

  return parseListResponse(response.data, 'تعذر تحميل قائمة المدن.');
}

export async function getAreas(cityId: string): Promise<Area[]> {
  const response = await apiClient.get<ApiEnvelope<Area[]>>(
    `${LOCATIONS_PATH}/cities/${cityId}/areas`,
  );

  return parseListResponse(response.data, 'تعذر تحميل قائمة المناطق.');
}

export async function getDistricts(areaId: string): Promise<District[]> {
  const response = await apiClient.get<ApiEnvelope<District[]>>(
    `${LOCATIONS_PATH}/areas/${areaId}/districts`,
  );

  return parseListResponse(response.data, 'تعذر تحميل قائمة الأحياء.');
}

export async function getTree(): Promise<LocationTreeNode[]> {
  const response = await apiClient.get<ApiEnvelope<LocationTreeNode[]>>(
    `${LOCATIONS_PATH}/tree`,
  );

  return parseListResponse(response.data, 'تعذر تحميل شجرة المواقع.');
}
