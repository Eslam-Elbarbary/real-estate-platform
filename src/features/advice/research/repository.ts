import {
  researchPartners,
  researchRequestDefinitions,
  researchServices,
  researchVideos,
} from './config';
import type {
  ResearchLandingView,
  ResearchRequestDefinition,
  ResearchRequestType,
} from './types';

export interface ResearchRepository {
  getLanding(): Promise<ResearchLandingView>;
  getRequestDefinition(
    type: ResearchRequestType,
  ): Promise<ResearchRequestDefinition | null>;
}

export class MockResearchRepository implements ResearchRepository {
  async getLanding(): Promise<ResearchLandingView> {
    return {
      services: researchServices,
      videos: researchVideos,
      partners: researchPartners,
    };
  }

  async getRequestDefinition(type: ResearchRequestType) {
    return researchRequestDefinitions[type] ?? null;
  }
}

let repository: ResearchRepository | undefined;

export function getResearchRepository(): ResearchRepository {
  repository ??= new MockResearchRepository();
  return repository;
}
