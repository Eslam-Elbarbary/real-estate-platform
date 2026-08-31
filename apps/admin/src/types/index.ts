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
  interested: number;
  closed: number;
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
}

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  hint?: string;
}

export interface DashboardActivityItem {
  id: string;
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
