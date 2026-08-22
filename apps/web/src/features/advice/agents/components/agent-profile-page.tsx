import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { agentCopy } from '../config';
import { buildAgentProfilePath } from '../search-params';
import type { AgentProfileView } from '../types';
import { AgentEmptyState } from './agent-result-list';
import { AgentPagination } from './agent-pagination';
import { AgentProfileHeader } from './agent-profile-header';
import { AgentPropertiesGrid } from './agent-properties-grid';

interface AgentProfilePageProps {
  view: AgentProfileView;
}

export function AgentProfilePage({ view }: AgentProfilePageProps) {
  const { agent, properties, page, totalPages } = view;

  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: agentCopy.breadcrumbHome, href: routes.home },
            { label: agentCopy.breadcrumbKnow, href: routes.advice.root },
            { label: agentCopy.breadcrumbAgents, href: routes.advice.agents.root },
            {
              label: agent.name,
              href: routes.advice.agents.profile(agent.slug),
            },
          ]}
        />
        <div className="mt-6">
          <AgentProfileHeader agent={agent} />
        </div>
        <section className="mt-8" aria-labelledby="agent-properties-heading">
          <h2 id="agent-properties-heading" className="sr-only">
            قائمة العقارات
          </h2>
          {properties.length === 0 ? (
            <AgentEmptyState
              title={agentCopy.emptyProperties}
              hint={agentCopy.emptyPropertiesHint}
              backHref={routes.advice.agents.root}
            />
          ) : (
            <AgentPropertiesGrid properties={properties} />
          )}
          <AgentPagination
            page={page}
            totalPages={totalPages}
            hrefFor={(nextPage) => buildAgentProfilePath(agent.slug, nextPage)}
          />
        </section>
      </Container>
    </div>
  );
}
