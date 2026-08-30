/** Aligned with apps/api Prisma RoleCode. */
export type UserRole =
  | 'USER'
  | 'BROKER'
  | 'DEVELOPER'
  | 'ADMIN'
  | 'MODERATOR';

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

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  hint?: string;
}

export interface DashboardOverview {
  stats: DashboardStat[];
  pendingApprovals: number;
  recentActivity: DashboardActivityItem[];
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AdminSectionMeta {
  title: string;
  description: string;
}
