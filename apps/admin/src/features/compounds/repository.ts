import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  Compound,
  CompoundFilters,
  CompoundListResult,
  CreateCompoundInput,
  UpdateCompoundInput,
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

const COMPOUNDS_PATH = '/api/v1/admin/compounds';

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for compounds',
      userMessage: 'يجب تسجيل الدخول لإدارة المشاريع.',
    });
  }
  return session.accessToken;
}

function parseListMeta(response: ApiEnvelope<Compound[]>): CompoundListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid compounds pagination meta',
      userMessage: 'تعذر تحميل قائمة المشاريع.',
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

function parseCompoundResponse(
  response: ApiEnvelope<Compound>,
  userMessage: string,
): Compound {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid compound response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function getCompounds(
  filters: CompoundFilters,
): Promise<CompoundListResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<Compound[]>>(COMPOUNDS_PATH, {
    accessToken,
    query: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      developerId: filters.developerId,
      areaId: filters.areaId,
      isActive: filters.isActive,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid compounds list response',
      userMessage: 'تعذر تحميل قائمة المشاريع.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function createCompound(
  input: CreateCompoundInput,
): Promise<Compound> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.post<ApiEnvelope<Compound>>(
    COMPOUNDS_PATH,
    input,
    { accessToken },
  );

  return parseCompoundResponse(response.data, 'تعذر إنشاء المشروع.');
}

export async function updateCompound(
  id: string,
  input: UpdateCompoundInput,
): Promise<Compound> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.patch<ApiEnvelope<Compound>>(
    `${COMPOUNDS_PATH}/${id}`,
    input,
    { accessToken },
  );

  return parseCompoundResponse(response.data, 'تعذر تحديث المشروع.');
}
