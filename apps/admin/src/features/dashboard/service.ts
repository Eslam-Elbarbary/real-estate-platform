import { getDashboardRepository } from '@/data/repositories';
import type { DashboardOverview } from '@/types';

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return getDashboardRepository().getOverview();
}
