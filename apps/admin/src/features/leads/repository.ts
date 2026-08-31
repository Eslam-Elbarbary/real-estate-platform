import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  AdminLead,
  LeadFilters,
  LeadListResult,
  LeadStatus,
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

const LEADS_PATH = '/api/v1/admin/leads';

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for leads',
      userMessage: 'يجب تسجيل الدخول لإدارة الطلبات.',
    });
  }
  return session.accessToken;
}

function parseListMeta(
  response: ApiEnvelope<AdminLead[]>,
): LeadListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid leads pagination meta',
      userMessage: 'تعذر تحميل قائمة الطلبات.',
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

function parseLeadResponse(
  response: ApiEnvelope<AdminLead>,
  userMessage: string,
): AdminLead {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid lead response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function getLeads(filters: LeadFilters): Promise<LeadListResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminLead[]>>(LEADS_PATH, {
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
      message: 'Invalid leads list response',
      userMessage: 'تعذر تحميل قائمة الطلبات.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function getLeadDetails(id: string): Promise<AdminLead> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminLead>>(
    `${LEADS_PATH}/${id}`,
    { accessToken },
  );

  return parseLeadResponse(response.data, 'تعذر تحميل تفاصيل الطلب.');
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<AdminLead> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.patch<ApiEnvelope<AdminLead>>(
    `${LEADS_PATH}/${id}/status`,
    { status },
    { accessToken },
  );

  return parseLeadResponse(response.data, 'تعذر تحديث حالة الطلب.');
}
