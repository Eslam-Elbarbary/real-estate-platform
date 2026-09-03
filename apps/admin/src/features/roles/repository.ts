import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPermissionCatalogItem,
  AdminRole,
  AdminRoleDetails,
  CreateRoleInput,
  RoleFilters,
  RoleListResult,
  SetRolePermissionsInput,
  UpdateRoleInput,
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

const ROLES_PATH = '/api/v1/admin/roles';
const PERMISSIONS_PATH = '/api/v1/admin/permissions';

function parseListMeta(response: ApiEnvelope<AdminRole[]>): RoleListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid roles pagination meta',
      userMessage: 'تعذر تحميل قائمة الأدوار.',
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

function parseRoleResponse(
  response: ApiEnvelope<AdminRoleDetails | AdminRole>,
  userMessage: string,
): AdminRoleDetails {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid role response',
      userMessage,
      details: response,
    });
  }

  const role = response.data;
  return {
    ...role,
    permissions: 'permissions' in role && Array.isArray(role.permissions)
      ? role.permissions
      : [],
  };
}

export async function getRoles(filters: RoleFilters): Promise<RoleListResult> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminRole[]>>(ROLES_PATH, {
    query: {
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid roles list response',
      userMessage: 'تعذر تحميل قائمة الأدوار.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: parseListMeta(response.data),
  };
}

export async function getRoleDetails(id: string): Promise<AdminRoleDetails> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminRoleDetails>>(
    `${ROLES_PATH}/${id}`,
  );

  return parseRoleResponse(response.data, 'تعذر تحميل تفاصيل الدور.');
}

export async function createRole(input: CreateRoleInput): Promise<AdminRoleDetails> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminRoleDetails>>(
    ROLES_PATH,
    input,
  );

  return parseRoleResponse(response.data, 'تعذر إنشاء الدور.');
}

export async function updateRole(
  id: string,
  input: UpdateRoleInput,
): Promise<AdminRoleDetails> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminRoleDetails>>(
    `${ROLES_PATH}/${id}`,
    input,
  );

  return parseRoleResponse(response.data, 'تعذر تحديث الدور.');
}

export async function deleteRole(id: string): Promise<{ message: string }> {
  const response = await authenticatedApiClient.delete<
    ApiEnvelope<{ message: string }>
  >(`${ROLES_PATH}/${id}`);

  if (!response.data.success) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid role delete response',
      userMessage: 'تعذر حذف الدور.',
      details: response.data,
    });
  }

  return {
    message: response.data.data?.message ?? response.data.message ?? 'Role deleted successfully',
  };
}

export async function setRolePermissions(
  id: string,
  input: SetRolePermissionsInput,
): Promise<AdminRoleDetails> {
  const response = await authenticatedApiClient.put<ApiEnvelope<AdminRoleDetails>>(
    `${ROLES_PATH}/${id}/permissions`,
    input,
  );

  return parseRoleResponse(response.data, 'تعذر تحديث صلاحيات الدور.');
}

export async function getPermissionsCatalog(): Promise<AdminPermissionCatalogItem[]> {
  const response = await authenticatedApiClient.get<
    ApiEnvelope<AdminPermissionCatalogItem[]>
  >(PERMISSIONS_PATH);

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid permissions catalog response',
      userMessage: 'تعذر تحميل قائمة الصلاحيات.',
      details: response.data,
    });
  }

  return response.data.data;
}
