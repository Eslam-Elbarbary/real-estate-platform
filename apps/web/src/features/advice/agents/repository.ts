import { demoAgents } from './demo-agents';
import type { RealEstateAgent } from './types';

export interface AgentRepository {
  getAgents(): Promise<RealEstateAgent[]>;
  getAgentBySlug(slug: string): Promise<RealEstateAgent | null>;
}

export class MockAgentRepository implements AgentRepository {
  async getAgents(): Promise<RealEstateAgent[]> {
    return [...demoAgents];
  }

  async getAgentBySlug(slug: string): Promise<RealEstateAgent | null> {
    return demoAgents.find((agent) => agent.slug === slug) ?? null;
  }
}

let repository: AgentRepository | undefined;

export function getAgentRepository(): AgentRepository {
  repository ??= new MockAgentRepository();
  return repository;
}
