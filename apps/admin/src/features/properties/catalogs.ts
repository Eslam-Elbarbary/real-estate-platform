import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  CatalogFeature,
  CatalogLegalStatus,
  CatalogPropertyType,
  CatalogPropertyView,
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
  const [
    propertyTypesRes,
    transactionTypesRes,
    featuresRes,
    propertyViewsRes,
    legalStatusesRes,
  ] = await Promise.all([
    apiClient.get<ApiEnvelope<CatalogPropertyType[]>>(
      '/api/v1/catalogs/property-types',
    ),
    apiClient.get<ApiEnvelope<CatalogTransactionType[]>>(
      '/api/v1/catalogs/transaction-types',
    ),
    apiClient.get<ApiEnvelope<CatalogFeature[]>>('/api/v1/catalogs/features'),
    apiClient.get<ApiEnvelope<CatalogPropertyView[]>>(
      '/api/v1/catalogs/property-views',
    ),
    apiClient.get<ApiEnvelope<CatalogLegalStatus[]>>(
      '/api/v1/catalogs/property-legal-statuses',
    ),
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
    propertyViews: parseCatalogList(
      propertyViewsRes.data,
      'تعذر تحميل الإطلالات.',
    ),
    legalStatuses: parseCatalogList(
      legalStatusesRes.data,
      'تعذر تحميل الحالات القانونية.',
    ),
  };
}
