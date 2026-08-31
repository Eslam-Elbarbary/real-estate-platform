import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPropertiesFilters,
  AdminPropertiesListResult,
  AdminPropertyActionResult,
  AdminPropertyDetails,
  Property,
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
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for properties list',
      userMessage: 'يجب تسجيل الدخول لعرض العقارات.',
    });
  }

  const response = await apiClient.get<ApiEnvelope<Property[]>>(PROPERTIES_PATH, {
    accessToken: session.accessToken,
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
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for property details',
      userMessage: 'يجب تسجيل الدخول لعرض تفاصيل العقار.',
    });
  }

  const response = await apiClient.get<ApiEnvelope<AdminPropertyDetails>>(
    `${PROPERTIES_PATH}/${id}`,
    { accessToken: session.accessToken },
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

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for property action',
      userMessage: 'يجب تسجيل الدخول لتنفيذ هذا الإجراء.',
    });
  }
  return session.accessToken;
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
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/approve`,
    undefined,
    { accessToken },
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
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/reject`,
    { reason },
    { accessToken },
  );

  return parseActionResponse(
    response.data,
    'تعذر رفض العقار.',
  );
}

export async function archiveProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/archive`,
    undefined,
    { accessToken },
  );

  return parseActionResponse(
    response.data,
    'تعذر أرشفة العقار.',
  );
}
