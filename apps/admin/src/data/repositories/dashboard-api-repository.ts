import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
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
    const response = await authenticatedApiClient.get<ApiEnvelope<AdminDashboardStats>>(
      DASHBOARD_PATH,
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
