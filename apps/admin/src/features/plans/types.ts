export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface PlanFeatures {
  listingLimit?: number;
  featuredBoost?: boolean;
  [key: string]: unknown;
}

/** Matches NestJS AdminPlanDto. */
export interface AdminPlan {
  id: string;
  code: string;
  name: string;
  price: number;
  durationDays: number;
  features: PlanFeatures;
  status: PlanStatus;
  subscriptionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFilters {
  search?: string;
  status?: PlanStatus;
  page?: number;
  limit?: number;
}

export interface PlanPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PlanListResult {
  items: AdminPlan[];
  meta: PlanPaginationMeta;
}

export interface CreatePlanInput {
  code: string;
  name: string;
  price: number;
  durationDays: number;
  features?: PlanFeatures;
  status?: PlanStatus;
}

export interface UpdatePlanInput {
  code?: string;
  name?: string;
  price?: number;
  durationDays?: number;
  features?: PlanFeatures;
  status?: PlanStatus;
}
