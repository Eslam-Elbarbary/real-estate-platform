import { getDashboardRepository } from '@/data/repositories';
import type {
  AdminDashboardStats,
  DashboardActivityItem,
  DashboardOverview,
} from '@/types';

function buildRecentActivity(data: AdminDashboardStats): DashboardActivityItem[] {
  const now = new Date().toISOString();

  return [
    {
      id: 'properties-pending',
      title: 'عقارات بانتظار المراجعة',
      description: `${data.properties.pendingReview} عقار في قائمة المراجعة`,
      createdAt: now,
    },
    {
      id: 'subscriptions-active',
      title: 'الاشتراكات النشطة',
      description: `${data.subscriptions.active} اشتراك نشط من أصل ${data.subscriptions.total}`,
      createdAt: now,
    },
    {
      id: 'leads-new',
      title: 'عملاء محتملون جدد',
      description: `${data.leads.new} عميل جديد · ${data.leads.total} إجمالي الاستفسارات`,
      createdAt: now,
    },
  ];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const data = await getDashboardRepository().getOverview();

  return {
    data,
    recentActivity: buildRecentActivity(data),
  };
}
