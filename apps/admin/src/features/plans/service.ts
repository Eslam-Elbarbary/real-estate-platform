import {
  createPlan,
  getPlanDetails,
  getPlans,
  updatePlan,
} from './repository';
import type {
  AdminPlan,
  CreatePlanInput,
  PlanFilters,
  PlanListResult,
  UpdatePlanInput,
} from './types';

export async function getAdminPlans(
  filters: PlanFilters = {},
): Promise<PlanListResult> {
  return getPlans({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    status: filters.status,
  });
}

export async function getAdminPlanDetails(id: string): Promise<AdminPlan> {
  return getPlanDetails(id);
}

export async function createAdminPlan(input: CreatePlanInput): Promise<AdminPlan> {
  return createPlan({
    code: input.code.trim().toUpperCase(),
    name: input.name.trim(),
    price: input.price,
    durationDays: input.durationDays,
    features: input.features,
    status: input.status ?? 'ACTIVE',
  });
}

export async function updateAdminPlan(
  id: string,
  input: UpdatePlanInput,
): Promise<AdminPlan> {
  return updatePlan(id, {
    code: input.code?.trim().toUpperCase(),
    name: input.name?.trim(),
    price: input.price,
    durationDays: input.durationDays,
    features: input.features,
    status: input.status,
  });
}
