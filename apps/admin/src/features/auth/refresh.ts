import { apiClient } from '@/lib/api/client';
import { logAdminErrorInDev } from '@/lib/dev/admin-log';
import { AdminError } from '@/lib/errors';
import type { AdminAuthUser } from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    roles: string[];
    permissions: string[];
  };
}

const REFRESH_PATH = '/api/v1/auth/refresh';

export interface RefreshedAdminTokens {
  accessToken: string;
  refreshToken: string;
  user: AdminAuthUser;
}

function mapAuthUser(user: RefreshResponseData['user']): AdminAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name?.trim() || user.email,
    roles: user.roles,
    permissions: user.permissions ?? [],
    isAdmin: false,
  };
}

function isValidRefreshData(data: RefreshResponseData | undefined): data is RefreshResponseData {
  return Boolean(
    data?.accessToken &&
      data.refreshToken &&
      data.user?.id &&
      data.user.email &&
      Array.isArray(data.user.permissions),
  );
}

/**
 * Calls the NestJS refresh endpoint and returns validated tokens.
 * Does not read or write cookies.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshedAdminTokens | null> {
  try {
    const response = await apiClient.post<ApiEnvelope<RefreshResponseData>>(
      REFRESH_PATH,
      { refreshToken },
      { skipRefresh: true },
    );

    const payload = response.data;

    if (!payload.success || !isValidRefreshData(payload.data)) {
      logAdminErrorInDev('auth:refresh-api', new Error('Invalid refresh response payload'), {
        success: payload.success,
        message: payload.message,
      });
      return null;
    }

    return {
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
      user: mapAuthUser(payload.data.user),
    };
  } catch (error) {
    if (error instanceof AdminError && (error.code === 'NETWORK' || error.code === 'TIMEOUT')) {
      throw error;
    }
    logAdminErrorInDev('auth:refresh-api', error);
    return null;
  }
}
