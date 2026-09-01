import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPropertiesFilters,
  AdminPropertiesListResult,
  AdminPropertyActionResult,
  AdminPropertyDetails,
  CreatePropertyInput,
  Property,
  UpdatePropertyInput,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const PROPERTIES_PATH = '/api/v1/admin/properties';

export async function fetchAdminProperties(
  filters: AdminPropertiesFilters,
): Promise<AdminPropertiesListResult> {
  const response = await authenticatedApiClient.get<ApiEnvelope<Property[]>>(PROPERTIES_PATH, {
    query: {
      status: filters.status,
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid properties list response',
      userMessage: 'تعذر تحميل قائمة العقارات.',
      details: response.data,
    });
  }

  const meta = response.data.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid properties pagination meta',
      userMessage: 'تعذر تحميل قائمة العقارات.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages,
    },
  };
}

export async function getPropertyDetails(
  id: string,
): Promise<AdminPropertyDetails> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminPropertyDetails>>(
    `${PROPERTIES_PATH}/${id}`,
  );

  if (!response.data.success || !response.data.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property details response',
      userMessage: 'تعذر تحميل تفاصيل العقار.',
      details: response.data,
    });
  }

  return response.data.data;
}

function parseActionResponse(
  response: ApiEnvelope<AdminPropertyActionResult>,
  userMessage: string,
): AdminPropertyActionResult {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property action response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function approveProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/approve`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر اعتماد العقار.',
  );
}

export async function rejectProperty(
  id: string,
  reason: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/reject`,
    { reason },
  );

  return parseActionResponse(
    response.data,
    'تعذر رفض العقار.',
  );
}

export async function archiveProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/archive`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر أرشفة العقار.',
  );
}

function parsePropertyDetailsResponse(
  response: ApiEnvelope<AdminPropertyDetails>,
  userMessage: string,
): AdminPropertyDetails {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property response',
      userMessage,
      details: response,
    });
  }

  return response.data;
}

export async function createProperty(
  input: CreatePropertyInput,
): Promise<AdminPropertyDetails> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyDetails>>(
    PROPERTIES_PATH,
    input,
  );

  return parsePropertyDetailsResponse(response.data, 'تعذر إنشاء العقار.');
}

export async function updateProperty(
  id: string,
  input: UpdatePropertyInput,
): Promise<AdminPropertyDetails> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminPropertyDetails>>(
    `${PROPERTIES_PATH}/${id}`,
    input,
  );

  return parsePropertyDetailsResponse(response.data, 'تعذر تحديث العقار.');
}
