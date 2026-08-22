import type { Property } from '@/types';

export type RealEstateAgentType = 'company' | 'broker';

export interface RealEstateAgent {
  id: string;
  slug: string;
  type: RealEstateAgentType;
  name: string;
  logoUrl?: string;
  avatarUrl?: string;
  locationId: string;
  locationLabel: string;
  serviceAreaLabels?: string[];
  description?: string;
  memberSinceYear?: number;
  partnershipYears?: number;
  listingCount: number;
  customerCount: number;
  verified?: boolean;
  phone: string;
  whatsappPhone?: string;
  propertySellerId?: string;
}

export interface AgentDirectoryFilters {
  type: RealEstateAgentType;
  locationId?: string;
  q?: string;
  page: number;
}

export interface AgentDirectoryResult {
  items: RealEstateAgent[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: AgentDirectoryFilters;
  locationLabel?: string;
}

export interface AgentProfileView {
  agent: RealEstateAgent;
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
