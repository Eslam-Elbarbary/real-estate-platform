import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  CatalogFeature,
  CatalogPropertyType,
  CatalogTransactionType,
  PropertyFormCatalogs,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

function parseCatalogList<T>(
  response: ApiEnvelope<T[]>,
  userMessage: string,
): T[] {
  if (!response.success || !Array.isArray(response.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid catalog response',
      userMessage,
      details: response,
    });
  }

  return response.data;
}

export async function fetchPropertyFormCatalogs(): Promise<PropertyFormCatalogs> {
  const [propertyTypesRes, transactionTypesRes, featuresRes] = await Promise.all([
    apiClient.get<ApiEnvelope<CatalogPropertyType[]>>(
      '/api/v1/catalogs/property-types',
    ),
    apiClient.get<ApiEnvelope<CatalogTransactionType[]>>(
      '/api/v1/catalogs/transaction-types',
    ),
    apiClient.get<ApiEnvelope<CatalogFeature[]>>('/api/v1/catalogs/features'),
  ]);

  return {
    propertyTypes: parseCatalogList(
      propertyTypesRes.data,
      'تعذر تحميل أنواع العقارات.',
    ),
    transactionTypes: parseCatalogList(
      transactionTypesRes.data,
      'تعذر تحميل أنواع المعاملات.',
    ),
    features: parseCatalogList(featuresRes.data, 'تعذر تحميل المميزات.'),
  };
}
