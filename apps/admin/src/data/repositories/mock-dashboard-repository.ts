import type { AdminDashboardStats } from '@/types';
import type { DashboardRepository } from './dashboard-repository';

const mockStats: AdminDashboardStats = {
  users: {
    total: 1284,
    active: 1102,
    inactive: 182,
    recent: 48,
  },
  properties: {
    total: 642,
    draft: 84,
    pendingReview: 12,
    published: 480,
    rejected: 28,
    archived: 30,
    expired: 8,
    recent: 36,
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
    totalRevenue: 445000,
  },
  leads: {
    total: 356,
    new: 44,
    contacted: 120,
    followUp: 68,
    interested: 98,
    closed: 94,
  },
  portfolio: {
    total: 642,
    published: 480,
    pendingReview: 12,
    rejected: 28,
    archived: 30,
  },
  inventory: [
    {
      propertyTypeId: '1',
      nameEn: 'Apartment',
      nameAr: 'شقة',
      count: 320,
      percentage: 49.8,
    },
    {
      propertyTypeId: '2',
      nameEn: 'Villa',
      nameAr: 'فيلا',
      count: 180,
      percentage: 28.0,
    },
    {
      propertyTypeId: '3',
      nameEn: 'Office',
      nameAr: 'مكتب',
      count: 90,
      percentage: 14.0,
    },
    {
      propertyTypeId: '4',
      nameEn: 'Commercial',
      nameAr: 'تجاري',
      count: 52,
      percentage: 8.1,
    },
  ],
  revenue: {
    totalRevenue: 445000,
    currentMonthRevenue: 52000,
    monthly: [
      { month: '2025-03', revenue: 28000 },
      { month: '2025-04', revenue: 35000 },
      { month: '2025-05', revenue: 42000 },
      { month: '2025-06', revenue: 38000 },
      { month: '2025-07', revenue: 45000 },
      { month: '2025-08', revenue: 52000 },
    ],
  },
  developers: [
    {
      id: 'd1',
      nameEn: 'Mountain View',
      nameAr: 'Mountain View',
      logoUrl: null,
      compoundCount: 8,
      publishedPropertyCount: 124,
      totalPropertyCount: 320,
    },
    {
      id: 'd2',
      nameEn: 'Palm Hills',
      nameAr: 'Palm Hills',
      logoUrl: null,
      compoundCount: 6,
      publishedPropertyCount: 98,
      totalPropertyCount: 240,
    },
  ],
  compounds: [
    {
      id: 'c1',
      nameEn: 'iCity October',
      nameAr: 'آي سيتي أكتوبر',
      developerName: 'Mountain View',
      locationName: '6 أكتوبر',
      publishedPropertyCount: 64,
      totalListings: 72,
    },
    {
      id: 'c2',
      nameEn: 'Badya',
      nameAr: 'باديا',
      developerName: 'Palm Hills',
      locationName: '6 أكتوبر',
      publishedPropertyCount: 48,
      totalListings: 55,
    },
  ],
  leadsIntelligence: {
    total: 356,
    conversionRate: 26.4,
    funnel: [
      { status: 'NEW', label: 'جديد', count: 44, conversionPercentage: 12.4 },
      { status: 'CONTACTED', label: 'تم التواصل', count: 120, conversionPercentage: 33.7 },
      { status: 'FOLLOW_UP', label: 'متابعة', count: 68, conversionPercentage: 19.1 },
      { status: 'CLOSED', label: 'مغلق', count: 94, conversionPercentage: 26.4 },
    ],
  },
  moderation: {
    pendingProperties: 12,
    pendingPayments: 21,
    newLeads: 44,
  },
  executive: {
    totalProperties: 642,
    totalDevelopers: 24,
    totalCompounds: 56,
    leadsToday: 7,
  },
  propertyGrowth: {
    monthly: [
      { month: '2025-03', count: 18 },
      { month: '2025-04', count: 22 },
      { month: '2025-05', count: 31 },
      { month: '2025-06', count: 27 },
      { month: '2025-07', count: 35 },
      { month: '2025-08', count: 36 },
    ],
  },
  recentLeads: [
    {
      id: 'rl-1',
      customerName: 'محمد أحمد',
      propertyTitle: 'Villa in New Cairo',
      status: 'INTERESTED',
      statusLabel: 'مهتم',
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 'rl-2',
      customerName: 'سارة محمود',
      propertyTitle: 'شقة فاخرة في التجمع',
      status: 'NEW',
      statusLabel: 'جديد',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  activity: [
    {
      id: 'status-1',
      type: 'property_status',
      title: 'تحديث حالة عقار',
      description: 'شقة فاخرة → PUBLISHED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lead-1',
      type: 'lead',
      title: 'عميل محتمل جديد',
      description: 'فيلا مودرن · NEW',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'payment-1',
      type: 'payment',
      title: 'دفعة ناجحة',
      description: '٥٬٠٠٠ جنيه',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
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
