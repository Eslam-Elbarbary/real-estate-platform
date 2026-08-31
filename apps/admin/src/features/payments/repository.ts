import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPayment,
  PaymentFilters,
  PaymentListResult,
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

const PAYMENTS_PATH = '/api/v1/admin/payments';

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for payments',
      userMessage: 'يجب تسجيل الدخول لإدارة المدفوعات.',
    });
  }
  return session.accessToken;
}

function parseListMeta(
  response: ApiEnvelope<AdminPayment[]>,
): PaymentListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid payments pagination meta',
      userMessage: 'تعذر تحميل قائمة المدفوعات.',
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

function parsePaymentResponse(
  response: ApiEnvelope<AdminPayment>,
  userMessage: string,
): AdminPayment {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid payment response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function getPayments(
  filters: PaymentFilters,
): Promise<PaymentListResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminPayment[]>>(
    PAYMENTS_PATH,
    {
      accessToken,
      query: {
        search: filters.search,
        status: filters.status,
        page: filters.page,
        limit: filters.limit,
      },
    },
  );

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid payments list response',
      userMessage: 'تعذر تحميل قائمة المدفوعات.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function getPaymentDetails(id: string): Promise<AdminPayment> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminPayment>>(
    `${PAYMENTS_PATH}/${id}`,
    { accessToken },
  );

  return parsePaymentResponse(response.data, 'تعذر تحميل تفاصيل الدفع.');
}
