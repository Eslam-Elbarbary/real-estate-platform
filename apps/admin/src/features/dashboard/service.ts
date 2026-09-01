import { getDashboardRepository } from '@/data/repositories';
import type { DashboardActivityItem, DashboardOverview } from '@/types';

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const data = await getDashboardRepository().getOverview();

  const recentActivity: DashboardActivityItem[] = data.activity ?? [];

  return {
    data,
    recentActivity,
  };
}
