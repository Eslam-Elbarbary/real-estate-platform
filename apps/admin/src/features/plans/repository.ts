import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPlan,
  CreatePlanInput,
  PlanFilters,
  PlanListResult,
  UpdatePlanInput,
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

const PLANS_PATH = '/api/v1/admin/plans';

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for plans',
      userMessage: 'يجب تسجيل الدخول لإدارة الخطط.',
    });
  }
  return session.accessToken;
}

function parseListMeta(response: ApiEnvelope<AdminPlan[]>): PlanListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid plans pagination meta',
      userMessage: 'تعذر تحميل قائمة الخطط.',
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

function parsePlanResponse(
  response: ApiEnvelope<AdminPlan>,
  userMessage: string,
): AdminPlan {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid plan response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function getPlans(filters: PlanFilters): Promise<PlanListResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminPlan[]>>(PLANS_PATH, {
    accessToken,
    query: {
      search: filters.search,
      status: filters.status,
      page: filters.page,
      limit: filters.limit,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid plans list response',
      userMessage: 'تعذر تحميل قائمة الخطط.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function getPlanDetails(id: string): Promise<AdminPlan> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminPlan>>(
    `${PLANS_PATH}/${id}`,
    { accessToken },
  );

  return parsePlanResponse(response.data, 'تعذر تحميل تفاصيل الخطة.');
}

export async function createPlan(input: CreatePlanInput): Promise<AdminPlan> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.post<ApiEnvelope<AdminPlan>>(
    PLANS_PATH,
    input,
    { accessToken },
  );

  return parsePlanResponse(response.data, 'تعذر إنشاء الخطة.');
}

export async function updatePlan(
  id: string,
  input: UpdatePlanInput,
): Promise<AdminPlan> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.patch<ApiEnvelope<AdminPlan>>(
    `${PLANS_PATH}/${id}`,
    input,
    { accessToken },
  );

  return parsePlanResponse(response.data, 'تعذر تحديث الخطة.');
}
