import type { DashboardOverview } from '@/types';
import type { DashboardRepository } from './dashboard-repository';

const mockOverview: DashboardOverview = {
  pendingApprovals: 12,
  stats: [
    {
      id: 'users',
      label: 'المستخدمون',
      value: 1284,
      hint: 'إجمالي الحسابات',
    },
    {
      id: 'properties',
      label: 'العقارات',
      value: 642,
      hint: 'منشورة ومسودات',
    },
    {
      id: 'pending',
      label: 'بانتظار المراجعة',
      value: 12,
      hint: 'تحتاج موافقة الإدارة',
    },
    {
      id: 'payments',
      label: 'المدفوعات',
      value: 89,
      hint: 'هذا الشهر',
    },
  ],
  recentActivity: [
    {
      id: '1',
      title: 'عقار جديد بانتظار المراجعة',
      description: 'شقة للبيع في القاهرة الجديدة — مقدم من وسيط',
      createdAt: '2026-08-23T10:15:00.000Z',
    },
    {
      id: '2',
      title: 'اشتراك Premium',
      description: 'دفع ناجح عبر مزود الدفع التجريبي',
      createdAt: '2026-08-23T09:40:00.000Z',
    },
    {
      id: '3',
      title: 'مطور جديد',
      description: 'تم إنشاء ملف مطور بانتظار التحقق',
      createdAt: '2026-08-22T18:05:00.000Z',
    },
  ],
};

class MockDashboardRepository implements DashboardRepository {
  async getOverview(): Promise<DashboardOverview> {
    return mockOverview;
  }
}

let repository: DashboardRepository | null = null;

export function getMockDashboardRepository(): DashboardRepository {
  if (!repository) {
    repository = new MockDashboardRepository();
  }

  return repository;
}
