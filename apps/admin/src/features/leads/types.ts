export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'FOLLOW_UP'
  | 'INTERESTED'
  | 'CLOSED'
  | 'REJECTED';

export type LeadType = 'PHONE' | 'WHATSAPP' | 'CONTACT_FORM';

export interface AdminLeadUser {
  id: string;
  name: string | null;
  email: string;
}

export interface AdminLeadProperty {
  id: string;
  title: string | null;
  slug: string;
}

/** Matches NestJS AdminLeadDto. */
export interface AdminLead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  message: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string;
  buyer: AdminLeadUser;
  seller: AdminLeadUser;
  property: AdminLeadProperty;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  search?: string;
}

export interface LeadPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadListResult {
  items: AdminLead[];
  meta: LeadPaginationMeta;
}
