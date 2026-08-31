import { apiClient } from '@/lib/api/client';
import { createAdminError } from '@/lib/errors';
import type { UserRole } from '@/types';
import {
  clearAdminSession,
  getStoredAdminSession,
  saveAdminSession,
} from './session';
import type {
  AdminAuthService,
  AdminAuthSession,
  AdminAuthUser,
  AdminLoginInput,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AdminLoginResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    roles: string[];
  };
}

const ADMIN_LOGIN_PATH = '/api/v1/admin/auth/login';

function mapAuthUser(user: AdminLoginResponseData['user']): AdminAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name?.trim() || user.email,
    roles: user.roles as UserRole[],
  };
}

function toAuthSession(
  user: AdminAuthUser,
  accessToken: string,
): AdminAuthSession {
  return {
    authenticated: true,
    user,
    accessToken,
  };
}

class NestAdminAuthService implements AdminAuthService {
  async getSession(): Promise<AdminAuthSession | null> {
    const stored = await getStoredAdminSession();
    if (!stored) {
      return null;
    }

    return toAuthSession(stored.user, stored.accessToken);
  }

  async login(input: AdminLoginInput): Promise<AdminAuthSession> {
    const response = await apiClient.post<ApiEnvelope<AdminLoginResponseData>>(
      ADMIN_LOGIN_PATH,
      input,
    );

    const payload = response.data;
    if (!payload.success || !payload.data?.accessToken) {
      throw createAdminError('UNAUTHORIZED', {
        message: 'Admin login failed',
        userMessage: 'فشل تسجيل الدخول. تحقق من البريد وكلمة المرور.',
      });
    }

    const user = mapAuthUser(payload.data.user);

    await saveAdminSession({
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
      user,
    });

    return toAuthSession(user, payload.data.accessToken);
  }

  async logout(): Promise<void> {
    await clearAdminSession();
  }
}

let authService: AdminAuthService | null = null;

export function getAuthService(): AdminAuthService {
  if (!authService) {
    authService = new NestAdminAuthService();
  }

  return authService;
}

export async function getAdminSession(): Promise<AdminAuthSession | null> {
  return getAuthService().getSession();
}
