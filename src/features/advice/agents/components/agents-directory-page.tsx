import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { agentCopy } from '../config';
import { buildAgentsPath } from '../search-params';
import type { AgentDirectoryResult } from '../types';
import { AgentPagination } from './agent-pagination';
import { AgentResultList } from './agent-result-list';
import { AgentsSearchHero } from './agents-search-hero';

interface LocationOption {
  id: string;
  name: string;
}

interface AgentsDirectoryPageProps {
  result: AgentDirectoryResult;
  locations: LocationOption[];
}

export function AgentsDirectoryPage({
  result,
  locations,
}: AgentsDirectoryPageProps) {
  const headingPrefix =
    result.filters.type === 'broker'
      ? agentCopy.resultsBroker
      : agentCopy.resultsCompany;
  const locationSuffix = result.locationLabel
    ? ` ${agentCopy.resultsIn(result.locationLabel)}`
    : '';

  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: agentCopy.breadcrumbHome, href: routes.home },
            { label: agentCopy.breadcrumbKnow, href: routes.advice.root },
            { label: agentCopy.breadcrumbAgents, href: routes.advice.agents.root },
          ]}
        />
        <div className="mt-5">
          <AgentsSearchHero filters={result.filters} locations={locations} />
        </div>
        <section className="mt-10" aria-labelledby="agents-results-heading">
          <h2
            id="agents-results-heading"
            className="text-center text-xl font-extrabold text-ink-950"
          >
            {headingPrefix}
            {locationSuffix}
          </h2>
          <p className="mt-2 text-center text-sm text-ink-600">
            {agentCopy.resultsSubtitle}
          </p>
          <div className="mt-6">
            <AgentResultList agents={result.items} />
          </div>
          <AgentPagination
            page={result.page}
            totalPages={result.totalPages}
            hrefFor={(page) => buildAgentsPath({ ...result.filters, page })}
          />
        </section>
      </Container>
    </div>
  );
}
