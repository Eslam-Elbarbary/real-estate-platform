import { apiClient } from '@/lib/api/client';
import { getStoredAdminSession } from '@/features/auth/session';
import { createAdminError } from '@/lib/errors';
import type { AdminDashboardStats } from '@/types';
import type { DashboardRepository } from './dashboard-repository';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const DASHBOARD_PATH = '/api/v1/admin/dashboard';

class ApiDashboardRepository implements DashboardRepository {
  async getOverview(): Promise<AdminDashboardStats> {
    const session = await getStoredAdminSession();
    if (!session?.accessToken) {
      throw createAdminError('UNAUTHORIZED', {
        message: 'Admin session required for dashboard',
        userMessage: 'يجب تسجيل الدخول لعرض لوحة التحكم.',
      });
    }

    const response = await apiClient.get<ApiEnvelope<AdminDashboardStats>>(
      DASHBOARD_PATH,
      { accessToken: session.accessToken },
    );

    if (!response.data.success || !response.data.data) {
      throw createAdminError('UNKNOWN', {
        message: 'Invalid dashboard response',
        userMessage: 'تعذر تحميل بيانات لوحة التحكم.',
        details: response.data,
      });
    }

    return response.data.data;
  }
}

let repository: DashboardRepository | null = null;

export function getApiDashboardRepository(): DashboardRepository {
  if (!repository) {
    repository = new ApiDashboardRepository();
  }

  return repository;
}
