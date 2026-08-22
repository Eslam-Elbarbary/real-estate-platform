import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import { ResearchPage, getResearchService } from '@/features/advice/research';

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(getResearchService().buildLandingMetadata());
}

export default async function AdviceResearchRoute() {
  const view = await getResearchService().getLanding();
  return <ResearchPage view={view} />;
}
