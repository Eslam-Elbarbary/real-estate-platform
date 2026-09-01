/** Aligned with apps/api Prisma RoleCode. */
export type UserRole =
  | 'USER'
  | 'BROKER'
  | 'DEVELOPER'
  | 'ADMIN'
  | 'MODERATOR'
  | 'SUPER_ADMIN';

/** Aligned with apps/api Prisma PropertyStatus. */
export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'EXPIRED';

/** @deprecated Prefer PropertyStatus */
export type PropertyReviewStatus = PropertyStatus;

/** Aligned with apps/api Prisma LeadStatus. */
export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'FOLLOW_UP'
  | 'INTERESTED'
  | 'CLOSED'
  | 'REJECTED';

/** Aligned with apps/api Prisma PlanCode / product plans. */
export type PlanCode = 'BASIC' | 'PREMIUM' | 'FEATURED';

/** Aligned with apps/api Prisma PaymentStatus. */
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

/** Aligned with apps/api Prisma SubscriptionStatus. */
export type SubscriptionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED';

/** Matches NestJS AdminDashboardUsersStatsDto. */
export interface AdminDashboardUsersStats {
  total: number;
  active: number;
  inactive: number;
  recent: number;
}

/** Matches NestJS AdminDashboardPropertiesStatsDto. */
export interface AdminDashboardPropertiesStats {
  total: number;
  draft: number;
  pendingReview: number;
  published: number;
  rejected: number;
  archived: number;
  expired: number;
  recent: number;
}

/** Matches NestJS AdminDashboardSubscriptionsStatsDto. */
export interface AdminDashboardSubscriptionsStats {
  total: number;
  pending: number;
  active: number;
}

/** Matches NestJS AdminDashboardPaymentsStatsDto. */
export interface AdminDashboardPaymentsStats {
  total: number;
  successful: number;
  pending: number;
  failed: number;
  totalRevenue: number;
}

/** Matches NestJS AdminDashboardLeadsStatsDto. */
export interface AdminDashboardLeadsStats {
  total: number;
  new: number;
  contacted: number;
  followUp: number;
  interested: number;
  closed: number;
}

export interface AdminDashboardPortfolio {
  total: number;
  published: number;
  pendingReview: number;
  rejected: number;
  archived: number;
}

export interface AdminDashboardInventoryItem {
  propertyTypeId: string;
  nameEn: string;
  nameAr: string | null;
  count: number;
  percentage: number;
}

export interface AdminDashboardMonthlyRevenue {
  month: string;
  revenue: number;
}

export interface AdminDashboardRevenueAnalytics {
  totalRevenue: number;
  currentMonthRevenue: number;
  monthly: AdminDashboardMonthlyRevenue[];
}

export interface AdminDashboardExecutiveSummary {
  totalProperties: number;
  totalDevelopers: number;
  totalCompounds: number;
  leadsToday: number;
}

export interface AdminDashboardMonthlyCount {
  month: string;
  count: number;
}

export interface AdminDashboardPropertyGrowth {
  monthly: AdminDashboardMonthlyCount[];
}

export interface AdminDashboardTopDeveloper {
  id: string;
  nameEn: string;
  nameAr: string | null;
  logoUrl: string | null;
  compoundCount: number;
  publishedPropertyCount: number;
  totalPropertyCount: number;
}

export interface AdminDashboardTopCompound {
  id: string;
  nameEn: string;
  nameAr: string | null;
  developerName: string | null;
  locationName: string | null;
  publishedPropertyCount: number;
  totalListings: number;
}

export interface AdminDashboardRecentLead {
  id: string;
  customerName: string;
  propertyTitle: string;
  status: string;
  statusLabel: string;
  createdAt: string;
}

export interface AdminDashboardLeadFunnelStage {
  status: string;
  label: string;
  count: number;
  conversionPercentage: number;
}

export interface AdminDashboardLeadsIntelligence {
  total: number;
  conversionRate: number;
  funnel: AdminDashboardLeadFunnelStage[];
}

export interface AdminDashboardModeration {
  pendingProperties: number;
  pendingPayments: number;
  newLeads: number;
}

/**
 * Full admin dashboard payload from GET /api/v1/admin/dashboard.
 * Matches NestJS AdminDashboardStatsDto.
 */
export interface AdminDashboardStats {
  users: AdminDashboardUsersStats;
  properties: AdminDashboardPropertiesStats;
  subscriptions: AdminDashboardSubscriptionsStats;
  payments: AdminDashboardPaymentsStats;
  leads: AdminDashboardLeadsStats;
  portfolio: AdminDashboardPortfolio;
  inventory: AdminDashboardInventoryItem[];
  revenue: AdminDashboardRevenueAnalytics;
  developers: AdminDashboardTopDeveloper[];
  compounds: AdminDashboardTopCompound[];
  leadsIntelligence: AdminDashboardLeadsIntelligence;
  moderation: AdminDashboardModeration;
  executive: AdminDashboardExecutiveSummary;
  propertyGrowth: AdminDashboardPropertyGrowth;
  recentLeads: AdminDashboardRecentLead[];
  activity: DashboardActivityItem[];
}

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  hint?: string;
}

export interface DashboardActivityItem {
  id: string;
  type?: string;
  title: string;
  description: string;
  createdAt: string;
}

/**
 * Dashboard view model: complete backend stats plus UI-only activity rows.
 */
export interface DashboardOverview {
  data: AdminDashboardStats;
  recentActivity: DashboardActivityItem[];
}

export interface AdminSectionMeta {
  title: string;
  description: string;
}
