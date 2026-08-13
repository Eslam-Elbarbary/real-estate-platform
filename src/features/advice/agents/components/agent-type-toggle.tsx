import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { agentCopy } from '../config';
import { buildAgentsPath } from '../search-params';
import type { AgentDirectoryFilters, RealEstateAgentType } from '../types';

interface AgentTypeToggleProps {
  filters: AgentDirectoryFilters;
}

const options: Array<{ value: RealEstateAgentType; label: string }> = [
  { value: 'company', label: agentCopy.company },
  { value: 'broker', label: agentCopy.broker },
];

export function AgentTypeToggle({ filters }: AgentTypeToggleProps) {
  return (
    <div
      role="group"
      aria-label="نوع الحساب"
      className="mx-auto inline-flex rounded-full bg-white p-1"
    >
      {options.map((option) => {
        const active = filters.type === option.value;
        return (
          <Link
            key={option.value}
            href={buildAgentsPath({ ...filters, type: option.value, page: 1 })}
            aria-pressed={active}
            className={cn(
              'min-w-[5.5rem] rounded-full px-5 py-1.5 text-center text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              active
                ? 'bg-accent-500 text-white'
                : 'text-ink-700 hover:bg-surface-50',
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
