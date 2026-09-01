import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
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
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminPlan[]>>(PLANS_PATH, {
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
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminPlan>>(
    `${PLANS_PATH}/${id}`,
  );

  return parsePlanResponse(response.data, 'تعذر تحميل تفاصيل الخطة.');
}

export async function createPlan(input: CreatePlanInput): Promise<AdminPlan> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPlan>>(
    PLANS_PATH,
    input,
  );

  return parsePlanResponse(response.data, 'تعذر إنشاء الخطة.');
}

export async function updatePlan(
  id: string,
  input: UpdatePlanInput,
): Promise<AdminPlan> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminPlan>>(
    `${PLANS_PATH}/${id}`,
    input,
  );

  return parsePlanResponse(response.data, 'تعذر تحديث الخطة.');
}
