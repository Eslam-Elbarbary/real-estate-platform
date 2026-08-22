import { getLocationRepository } from '@/data/repositories';
import { getPropertyRepository } from '@/data/repositories';
import type { PageSeoInput } from '@/lib/seo/metadata';
import type { Location } from '@/types';
import { routes } from '@/config/routes';
import {
  AGENT_DIRECTORY_PAGE_SIZE,
  AGENT_PROFILE_PAGE_SIZE,
  agentCopy,
} from './config';
import {
  getAgentRepository,
  type AgentRepository,
} from './repository';
import type {
  AgentDirectoryFilters,
  AgentDirectoryResult,
  AgentProfileView,
  RealEstateAgent,
} from './types';

function rankScore(agent: RealEstateAgent): number {
  return (
    agent.customerCount / 100 +
    agent.listingCount +
    (agent.partnershipYears ?? 0) * 2 +
    (agent.verified ? 20 : 0)
  );
}

function locationMatches(
  agent: RealEstateAgent,
  locationId: string | undefined,
  locations: Location[],
): boolean {
  if (!locationId) return true;
  if (agent.locationId === locationId) return true;

  const byId = new Map(locations.map((item) => [item.id, item]));
  const selected = byId.get(locationId);
  if (!selected) return false;

  const agentLocation = byId.get(agent.locationId);
  if (!agentLocation) return false;

  const selectedAndDescendants = new Set<string>([selected.id]);
  if (locationId === 'loc-greater-cairo') {
    for (const item of locations) {
      if (item.id === 'loc-cairo' || item.id === 'loc-giza') {
        selectedAndDescendants.add(item.id);
      }
    }
  }
  let grew = true;
  while (grew) {
    grew = false;
    for (const location of locations) {
      if (!location.parentSlug) continue;
      const parent = locations.find((item) => item.slug === location.parentSlug);
      if (parent && selectedAndDescendants.has(parent.id) && !selectedAndDescendants.has(location.id)) {
        selectedAndDescendants.add(location.id);
        grew = true;
      }
    }
  }

  if (selectedAndDescendants.has(agent.locationId)) return true;

  const agentAncestors = new Set<string>([agentLocation.id]);
  let current = agentLocation;
  while (current.parentSlug) {
    const parent = locations.find((item) => item.slug === current.parentSlug);
    if (!parent) break;
    agentAncestors.add(parent.id);
    current = parent;
  }

  return agentAncestors.has(selected.id);
}

export class AgentService {
  constructor(
    private readonly repository: AgentRepository = getAgentRepository(),
  ) {}

  async listAgents(filters: AgentDirectoryFilters): Promise<AgentDirectoryResult> {
    const [agents, locations] = await Promise.all([
      this.repository.getAgents(),
      getLocationRepository().findAll(),
    ]);
    const propertyRepository = getPropertyRepository();

    const enriched = await Promise.all(
      agents.map(async (agent) => {
        if (!agent.propertySellerId) {
          return { ...agent, listingCount: 0 };
        }
        const listings = await propertyRepository.search({
          sellerId: agent.propertySellerId,
          pageSize: 1,
        });
        return { ...agent, listingCount: listings.total };
      }),
    );

    const filtered = enriched
      .filter((agent) => agent.type === filters.type)
      .filter((agent) => locationMatches(agent, filters.locationId, locations))
      .filter((agent) => {
        if (!filters.q) return true;
        return agent.name.toLowerCase().includes(filters.q.toLowerCase());
      })
      .sort((left, right) => {
        const score = rankScore(right) - rankScore(left);
        if (score !== 0) return score;
        return left.name.localeCompare(right.name, 'ar');
      });

    const pageSize = AGENT_DIRECTORY_PAGE_SIZE;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * pageSize;
    const locationLabel = filters.locationId
      ? locations.find((item) => item.id === filters.locationId)?.name
      : undefined;

    return {
      items: filtered.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
      filters: { ...filters, page },
      locationLabel,
    };
  }

  async getProfile(
    slug: string,
    page = 1,
  ): Promise<AgentProfileView | null> {
    const agent = await this.repository.getAgentBySlug(slug);
    if (!agent) return null;

    const propertyRepository = getPropertyRepository();
    const result = agent.propertySellerId
      ? await propertyRepository.search({
          sellerId: agent.propertySellerId,
          page,
          pageSize: AGENT_PROFILE_PAGE_SIZE,
          sort: 'newest',
        })
      : {
          items: [],
          total: 0,
          page: 1,
          pageSize: AGENT_PROFILE_PAGE_SIZE,
          totalPages: 1,
        };

    return {
      agent: { ...agent, listingCount: result.total },
      properties: result.items,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  buildDirectoryMetadata(): PageSeoInput {
    return {
      title: agentCopy.seoDirectoryTitle,
      description: agentCopy.seoDirectoryDescription,
      path: routes.advice.agents.root,
    };
  }

  buildProfileMetadata(agent: RealEstateAgent): PageSeoInput {
    const typeLabel = agent.type === 'company' ? agentCopy.company : agentCopy.broker;
    return {
      title: agent.name,
      description: `${typeLabel} في ${agent.locationLabel} — ${agent.listingCount} إعلان متاح للمعاينة.`,
      path: routes.advice.agents.profile(agent.slug),
    };
  }
}

let service: AgentService | undefined;

export function getAgentService(): AgentService {
  service ??= new AgentService();
  return service;
}
