import type { DashboardOverview } from '@/types';

export interface DashboardRepository {
  getOverview(): Promise<DashboardOverview>;
}
