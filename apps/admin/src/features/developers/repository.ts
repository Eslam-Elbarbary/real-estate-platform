import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  CreateDeveloperInput,
  Developer,
  DeveloperDetails,
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
  const response = await authenticatedApiClient.get<ApiEnvelope<Developer[]>>(DEVELOPERS_PATH, {
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

export async function getDeveloper(id: string): Promise<DeveloperDetails> {
  const response = await authenticatedApiClient.get<ApiEnvelope<DeveloperDetails>>(
    `${DEVELOPERS_PATH}/${id}`,
  );

  if (!response.data.success || !response.data.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid developer details response',
      userMessage: 'تعذر تحميل تفاصيل المطور.',
      details: response.data,
    });
  }

  return response.data.data;
}

export async function createDeveloper(
  data: CreateDeveloperInput,
): Promise<Developer> {
  const response = await authenticatedApiClient.post<ApiEnvelope<Developer>>(
    DEVELOPERS_PATH,
    data,
  );

  return parseDeveloperResponse(response.data, 'تعذر إنشاء المطور.');
}

export async function updateDeveloper(
  id: string,
  data: UpdateDeveloperInput,
): Promise<Developer> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<Developer>>(
    `${DEVELOPERS_PATH}/${id}`,
    data,
  );

  return parseDeveloperResponse(response.data, 'تعذر تحديث المطور.');
}
