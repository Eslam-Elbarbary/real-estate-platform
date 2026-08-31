import { getStoredAdminSession } from '@/features/auth/session';
import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type {
  AdminUser,
  AdminUserDetails,
  UserFilters,
  UserListResult,
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

const USERS_PATH = '/api/v1/admin/users';

async function requireSessionAccessToken(): Promise<string> {
  const session = await getStoredAdminSession();
  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required for users',
      userMessage: 'يجب تسجيل الدخول لإدارة المستخدمين.',
    });
  }
  return session.accessToken;
}

function parseListMeta(response: ApiEnvelope<AdminUser[]>): UserListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid users pagination meta',
      userMessage: 'تعذر تحميل قائمة المستخدمين.',
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

function parseUserResponse(
  response: ApiEnvelope<AdminUserDetails>,
  userMessage: string,
): AdminUserDetails {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid user response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function getUsers(filters: UserFilters): Promise<UserListResult> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminUser[]>>(USERS_PATH, {
    accessToken,
    query: {
      search: filters.search,
      role: filters.role,
      status: filters.status,
      page: filters.page,
      limit: filters.limit,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid users list response',
      userMessage: 'تعذر تحميل قائمة المستخدمين.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function getUserDetails(id: string): Promise<AdminUserDetails> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.get<ApiEnvelope<AdminUserDetails>>(
    `${USERS_PATH}/${id}`,
    { accessToken },
  );

  return parseUserResponse(response.data, 'تعذر تحميل تفاصيل المستخدم.');
}

export async function updateUserStatus(
  id: string,
  isActive: boolean,
): Promise<AdminUserDetails> {
  const accessToken = await requireSessionAccessToken();

  const response = await apiClient.patch<ApiEnvelope<AdminUserDetails>>(
    `${USERS_PATH}/${id}/status`,
    { isActive },
    { accessToken },
  );

  return parseUserResponse(response.data, 'تعذر تحديث حالة المستخدم.');
}
