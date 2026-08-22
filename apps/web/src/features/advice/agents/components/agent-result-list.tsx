import Link from 'next/link';
import { agentCopy } from '../config';
import { routes } from '@/config/routes';
import type { RealEstateAgent } from '../types';
import { AgentResultRow } from './agent-result-row';

interface AgentResultListProps {
  agents: RealEstateAgent[];
}

export function AgentEmptyState({
  title,
  hint,
  backHref,
}: {
  title: string;
  hint: string;
  backHref?: string;
}) {
  return (
    <div className="border border-dashed border-[#ececec] px-4 py-12 text-center">
      <p className="font-bold text-ink-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-600">{hint}</p>
      {backHref ? (
        <p className="mt-4">
          <Link
            href={backHref}
            className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {agentCopy.backToDirectory}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export function AgentResultList({ agents }: AgentResultListProps) {
  if (agents.length === 0) {
    return (
      <AgentEmptyState
        title={agentCopy.emptyAgents}
        hint={agentCopy.emptyAgentsHint}
        backHref={routes.advice.agents.root}
      />
    );
  }

  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <AgentResultRow key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
