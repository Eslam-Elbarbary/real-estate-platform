import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminUser,
  AdminUserDetails,
  AdminUserRole,
  AdminUserSelectItem,
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
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminUser[]>>(USERS_PATH, {
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
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminUserDetails>>(
    `${USERS_PATH}/${id}`,
  );

  return parseUserResponse(response.data, 'تعذر تحميل تفاصيل المستخدم.');
}

export async function updateUserStatus(
  id: string,
  isActive: boolean,
): Promise<AdminUserDetails> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminUserDetails>>(
    `${USERS_PATH}/${id}/status`,
    { isActive },
  );

  return parseUserResponse(response.data, 'تعذر تحديث حالة المستخدم.');
}

export async function selectUsers(
  search?: string,
  limit = 20,
): Promise<AdminUserSelectItem[]> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminUserSelectItem[]>>(
    `${USERS_PATH}/select`,
    {
      query: {
        search: search?.trim() || undefined,
        limit,
      },
    },
  );

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid user select response',
      userMessage: 'تعذر البحث عن المستخدمين.',
      details: response.data,
    });
  }

  return response.data.data;
}

function parseUserRoleResponse(
  response: ApiEnvelope<AdminUserRole>,
  userMessage: string,
): AdminUserRole {
  if (!response.success || !response.data?.id || !response.data?.code) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid user role response',
      userMessage,
      details: response,
    });
  }

  return {
    ...response.data,
    assignedAt: new Date(response.data.assignedAt).toISOString(),
  };
}

export async function getUserRoles(userId: string): Promise<AdminUserRole[]> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminUserRole[]>>(
    `${USERS_PATH}/${userId}/roles`,
  );

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid user roles list response',
      userMessage: 'تعذر تحميل أدوار المستخدم.',
      details: response.data,
    });
  }

  return response.data.data.map((role) => ({
    ...role,
    assignedAt: new Date(role.assignedAt).toISOString(),
  }));
}

export async function assignUserRole(
  userId: string,
  roleCode: string,
): Promise<AdminUserRole> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminUserRole>>(
    `${USERS_PATH}/${userId}/roles`,
    { roleCode },
  );

  return parseUserRoleResponse(response.data, 'تعذر تعيين الدور للمستخدم.');
}

export async function removeUserRole(
  userId: string,
  roleCode: string,
): Promise<AdminUserRole> {
  const response = await authenticatedApiClient.delete<ApiEnvelope<AdminUserRole>>(
    `${USERS_PATH}/${userId}/roles/${encodeURIComponent(roleCode)}`,
  );

  return parseUserRoleResponse(response.data, 'تعذر إزالة الدور من المستخدم.');
}
