import {
  getLeadDetails,
  getLeads,
  updateLeadStatus,
} from './repository';
import type { AdminLead, LeadFilters, LeadListResult, LeadStatus } from './types';

export async function getAdminLeads(
  filters: LeadFilters = {},
): Promise<LeadListResult> {
  return getLeads({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    status: filters.status,
  });
}

export async function getAdminLeadDetails(id: string): Promise<AdminLead> {
  return getLeadDetails(id);
}

export async function updateAdminLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<AdminLead> {
  return updateLeadStatus(id, status);
}
