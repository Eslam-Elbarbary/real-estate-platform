import type { PageSeoInput } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { researchCopy } from './config';
import {
  getResearchRepository,
  type ResearchRepository,
} from './repository';
import type {
  ResearchLandingView,
  ResearchRequestDefinition,
  ResearchRequestType,
} from './types';

export class ResearchService {
  constructor(
    private readonly repository: ResearchRepository = getResearchRepository(),
  ) {}

  getLanding(): Promise<ResearchLandingView> {
    return this.repository.getLanding();
  }

  getRequestDefinition(
    type: ResearchRequestType,
  ): Promise<ResearchRequestDefinition | null> {
    return this.repository.getRequestDefinition(type);
  }

  buildLandingMetadata(): PageSeoInput {
    return {
      title: researchCopy.seoTitle,
      description: researchCopy.seoDescription,
      path: routes.advice.research.root,
    };
  }

  buildRequestMetadata(definition: ResearchRequestDefinition): PageSeoInput {
    return {
      title: definition.title,
      description: definition.description,
      path: routes.advice.research.request(definition.type),
      noIndex: true,
    };
  }
}

let service: ResearchService | undefined;

export function getResearchService(): ResearchService {
  service ??= new ResearchService();
  return service;
}
