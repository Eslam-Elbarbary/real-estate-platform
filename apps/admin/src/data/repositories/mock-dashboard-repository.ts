import type { AdminDashboardStats } from '@/types';
import type { DashboardRepository } from './dashboard-repository';

const mockStats: AdminDashboardStats = {
  users: {
    total: 1284,
    active: 1102,
    inactive: 182,
  },
  properties: {
    total: 642,
    draft: 84,
    pendingReview: 12,
    published: 480,
    rejected: 28,
    archived: 30,
    expired: 8,
  },
  subscriptions: {
    total: 210,
    pending: 18,
    active: 192,
  },
  payments: {
    total: 120,
    successful: 89,
    pending: 21,
    failed: 10,
    totalRevenue: 44500,
  },
  leads: {
    total: 356,
    new: 44,
    contacted: 120,
    interested: 98,
    closed: 94,
  },
};

class MockDashboardRepository implements DashboardRepository {
  async getOverview(): Promise<AdminDashboardStats> {
    return mockStats;
  }
}

let repository: DashboardRepository | null = null;

export function getMockDashboardRepository(): DashboardRepository {
  if (!repository) {
    repository = new MockDashboardRepository();
  }

  return repository;
}
