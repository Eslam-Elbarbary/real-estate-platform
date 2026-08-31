import type { AdminDashboardStats } from '@/types';

export interface DashboardRepository {
  getOverview(): Promise<AdminDashboardStats>;
}
