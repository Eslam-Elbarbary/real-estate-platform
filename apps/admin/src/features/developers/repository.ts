import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  CreateDeveloperInput,
  Developer,
  DeveloperFilters,
  DeveloperListResult,
  UpdateDeveloperInput,
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

const DEVELOPERS_PATH = '/api/v1/admin/developers';

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for developers',
      userMessage: 'يجب تسجيل الدخول لإدارة المطورين.',
    });
  }
  return session.accessToken;
}

function parseListMeta(response: ApiEnvelope<Developer[]>): DeveloperListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid developers pagination meta',
      userMessage: 'تعذر تحميل قائمة المطورين.',
      details: response,
    });
  }

  return {
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
    totalPages: meta.totalPages,
  };
}

function parseDeveloperResponse(
  response: ApiEnvelope<Developer>,
  userMessage: string,
): Developer {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid developer response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function getDevelopers(
  filters: DeveloperFilters,
): Promise<DeveloperListResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<Developer[]>>(DEVELOPERS_PATH, {
    accessToken,
    query: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid developers list response',
      userMessage: 'تعذر تحميل قائمة المطورين.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function createDeveloper(
  data: CreateDeveloperInput,
): Promise<Developer> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.post<ApiEnvelope<Developer>>(
    DEVELOPERS_PATH,
    data,
    { accessToken },
  );

  return parseDeveloperResponse(response.data, 'تعذر إنشاء المطور.');
}

export async function updateDeveloper(
  id: string,
  data: UpdateDeveloperInput,
): Promise<Developer> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.patch<ApiEnvelope<Developer>>(
    `${DEVELOPERS_PATH}/${id}`,
    data,
    { accessToken },
  );

  return parseDeveloperResponse(response.data, 'تعذر تحديث المطور.');
}
