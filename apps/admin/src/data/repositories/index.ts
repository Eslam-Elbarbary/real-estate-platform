import { isApiDataSource } from '@/config/env';
import type { DashboardRepository } from './dashboard-repository';
import { getMockDashboardRepository } from './mock-dashboard-repository';

export type { DashboardRepository } from './dashboard-repository';

/**
 * Repository factory. Swaps mock → API when ADMIN_DATA_SOURCE=api
 * and an ApiDashboardRepository is available.
 */
export function getDashboardRepository(): DashboardRepository {
  if (isApiDataSource()) {
    // API repository lands when NestJS dashboard endpoints are wired.
    return getMockDashboardRepository();
  }

  return getMockDashboardRepository();
}
