import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getLocationOptions } from '@/features/locations';
import {
  AgentsDirectoryPage,
  getAgentService,
  parseAgentSearchParams,
} from '@/features/advice/agents';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(getAgentService().buildDirectoryMetadata());
}

export default async function AdviceAgentsPage({ searchParams }: PageProps) {
  const filters = parseAgentSearchParams(await searchParams);
  const [result, locations] = await Promise.all([
    getAgentService().listAgents(filters),
    getLocationOptions(),
  ]);

  return (
    <AgentsDirectoryPage
      result={result}
      locations={locations.map((item) => ({ id: item.id, name: item.name }))}
    />
  );
}
