import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminCatalogFeature,
  AdminCatalogFinishingType,
  AdminCatalogPropertyLegalStatus,
  AdminCatalogPropertyType,
  AdminCatalogPropertyView,
  AdminCatalogTransactionType,
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

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE = '/api/v1/admin/catalogs';

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

export async function listAdminPropertyTypes(
  search?: string,
): Promise<AdminCatalogPropertyType[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminCatalogPropertyType[]>
  >(`${BASE}/property-types${query}`);
  return unwrap(response.data, 'تعذر تحميل أنواع العقارات.');
}

export async function createAdminPropertyType(
  input: CreatePropertyTypeInput,
): Promise<AdminCatalogPropertyType> {
  const response = await authenticatedApiClient.post<
    ApiEnvelope<AdminCatalogPropertyType>
  >(`${BASE}/property-types`, input);
  return unwrap(response.data, 'تعذر إنشاء نوع العقار.');
}

export async function updateAdminPropertyType(
  id: string,
  input: UpdatePropertyTypeInput,
): Promise<AdminCatalogPropertyType> {
  const response = await authenticatedApiClient.patch<
    ApiEnvelope<AdminCatalogPropertyType>
  >(`${BASE}/property-types/${id}`, input);
  return unwrap(response.data, 'تعذر تحديث نوع العقار.');
}

export async function listAdminTransactionTypes(
  search?: string,
): Promise<AdminCatalogTransactionType[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminCatalogTransactionType[]>
  >(`${BASE}/transaction-types${query}`);
  return unwrap(response.data, 'تعذر تحميل أنواع المعاملات.');
}

export async function createAdminTransactionType(
  input: CreateTransactionTypeInput,
): Promise<AdminCatalogTransactionType> {
  const response = await authenticatedApiClient.post<
    ApiEnvelope<AdminCatalogTransactionType>
  >(`${BASE}/transaction-types`, input);
  return unwrap(response.data, 'تعذر إنشاء نوع المعاملة.');
}

export async function updateAdminTransactionType(
  id: string,
  input: UpdateTransactionTypeInput,
): Promise<AdminCatalogTransactionType> {
  const response = await authenticatedApiClient.patch<
    ApiEnvelope<AdminCatalogTransactionType>
  >(`${BASE}/transaction-types/${id}`, input);
  return unwrap(response.data, 'تعذر تحديث نوع المعاملة.');
}

export async function listAdminFeatures(filters?: {
  search?: string;
  category?: string;
}): Promise<AdminCatalogFeature[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.category) params.set('category', filters.category);
  const query = params.toString() ? `?${params}` : '';
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminCatalogFeature[]>
  >(`${BASE}/features${query}`);
  return unwrap(response.data, 'تعذر تحميل المميزات.');
}

export async function createAdminFeature(
  input: CreateFeatureInput,
): Promise<AdminCatalogFeature> {
  const response = await authenticatedApiClient.post<
    ApiEnvelope<AdminCatalogFeature>
  >(`${BASE}/features`, input);
  return unwrap(response.data, 'تعذر إنشاء الميزة.');
}

export async function updateAdminFeature(
  id: string,
  input: UpdateFeatureInput,
): Promise<AdminCatalogFeature> {
  const response = await authenticatedApiClient.patch<
    ApiEnvelope<AdminCatalogFeature>
  >(`${BASE}/features/${id}`, input);
  return unwrap(response.data, 'تعذر تحديث الميزة.');
}

export async function deleteAdminFeature(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  const response = await authenticatedApiClient.delete<
    ApiEnvelope<{ id: string; deleted: boolean }>
  >(`${BASE}/features/${id}`);
  return unwrap(response.data, 'تعذر حذف الميزة.');
}

export async function listAdminPropertyViews(
  search?: string,
): Promise<AdminCatalogPropertyView[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminCatalogPropertyView[]>
  >(`${BASE}/property-views${query}`);
  return unwrap(response.data, 'تعذر تحميل الإطلالات.');
}

export async function createAdminPropertyView(
  input: CreatePropertyViewInput,
): Promise<AdminCatalogPropertyView> {
  const response = await authenticatedApiClient.post<
    ApiEnvelope<AdminCatalogPropertyView>
  >(`${BASE}/property-views`, input);
  return unwrap(response.data, 'تعذر إنشاء الإطلالة.');
}

export async function updateAdminPropertyView(
  id: string,
  input: UpdatePropertyViewInput,
): Promise<AdminCatalogPropertyView> {
  const response = await authenticatedApiClient.patch<
    ApiEnvelope<AdminCatalogPropertyView>
  >(`${BASE}/property-views/${id}`, input);
  return unwrap(response.data, 'تعذر تحديث الإطلالة.');
}

export async function deleteAdminPropertyView(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  const response = await authenticatedApiClient.delete<
    ApiEnvelope<{ id: string; deleted: boolean }>
  >(`${BASE}/property-views/${id}`);
  return unwrap(response.data, 'تعذر حذف الإطلالة.');
}

export async function listAdminPropertyLegalStatuses(
  search?: string,
): Promise<AdminCatalogPropertyLegalStatus[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminCatalogPropertyLegalStatus[]>
  >(`${BASE}/property-legal-statuses${query}`);
  return unwrap(response.data, 'تعذر تحميل الحالات القانونية.');
}

export async function createAdminPropertyLegalStatus(
  input: CreatePropertyLegalStatusInput,
): Promise<AdminCatalogPropertyLegalStatus> {
  const response = await authenticatedApiClient.post<
    ApiEnvelope<AdminCatalogPropertyLegalStatus>
  >(`${BASE}/property-legal-statuses`, input);
  return unwrap(response.data, 'تعذر إنشاء الحالة القانونية.');
}

export async function updateAdminPropertyLegalStatus(
  id: string,
  input: UpdatePropertyLegalStatusInput,
): Promise<AdminCatalogPropertyLegalStatus> {
  const response = await authenticatedApiClient.patch<
    ApiEnvelope<AdminCatalogPropertyLegalStatus>
  >(`${BASE}/property-legal-statuses/${id}`, input);
  return unwrap(response.data, 'تعذر تحديث الحالة القانونية.');
}

export async function deleteAdminPropertyLegalStatus(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  const response = await authenticatedApiClient.delete<
    ApiEnvelope<{ id: string; deleted: boolean }>
  >(`${BASE}/property-legal-statuses/${id}`);
  return unwrap(response.data, 'تعذر حذف الحالة القانونية.');
}

export async function listAdminFinishingTypes(): Promise<
  AdminCatalogFinishingType[]
> {
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminCatalogFinishingType[]>
  >(`${BASE}/finishing-types`);
  return unwrap(response.data, 'تعذر تحميل أنواع التشطيب.');
}
