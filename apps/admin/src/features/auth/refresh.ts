import { apiClient } from '@/lib/api/client';
import type { UserRole } from '@/types';
import {
  clearAdminSession,
  getStoredAdminSession,
  saveAdminSession,
} from './session';
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
  };
}

const REFRESH_PATH = '/api/v1/auth/refresh';

function mapAuthUser(user: RefreshResponseData['user']): AdminAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name?.trim() || user.email,
    roles: user.roles as UserRole[],
  };
}

function isValidRefreshData(data: RefreshResponseData | undefined): data is RefreshResponseData {
  return Boolean(
    data?.accessToken &&
      data.refreshToken &&
      data.user?.id &&
      data.user.email,
  );
}

export async function refreshAdminSession(): Promise<string | false> {
  const session = await getStoredAdminSession();

  if (!session?.refreshToken) {
    return false;
  }

  try {
    const response = await apiClient.post<ApiEnvelope<RefreshResponseData>>(
      REFRESH_PATH,
      { refreshToken: session.refreshToken },
      { skipRefresh: true },
    );

    const payload = response.data;

    if (!payload.success || !isValidRefreshData(payload.data)) {
      await clearAdminSession();
      return false;
    }

    const accessToken = payload.data.accessToken;

    await saveAdminSession({
      accessToken,
      refreshToken: payload.data.refreshToken,
      user: mapAuthUser(payload.data.user),
    });

    return accessToken;
  } catch {
    await clearAdminSession();
    return false;
  }
}
