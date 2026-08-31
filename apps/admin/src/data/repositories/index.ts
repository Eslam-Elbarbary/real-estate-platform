import { isApiDataSource } from '@/config/env';
import type { DashboardRepository } from './dashboard-repository';
import { getApiDashboardRepository } from './dashboard-api-repository';
import { getMockDashboardRepository } from './mock-dashboard-repository';

export type { DashboardRepository } from './dashboard-repository';

/**
 * Repository factory. Swaps mock → API when ADMIN_DATA_SOURCE=api.
 */
export function getDashboardRepository(): DashboardRepository {
  if (isApiDataSource()) {
    return getApiDashboardRepository();
  }

  return getMockDashboardRepository();
}
