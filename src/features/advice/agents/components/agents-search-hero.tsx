import { MapPin } from 'lucide-react';
import { agentCopy } from '../config';
import { AgentTypeToggle } from './agent-type-toggle';
import type { AgentDirectoryFilters } from '../types';

interface LocationOption {
  id: string;
  name: string;
}

interface AgentsSearchHeroProps {
  filters: AgentDirectoryFilters;
  locations: LocationOption[];
}

export function AgentsSearchHero({ filters, locations }: AgentsSearchHeroProps) {
  return (
    <section className="rounded-md bg-brand-700 px-5 py-10 text-center text-white sm:px-10 sm:py-12">
      <h1 className="text-2xl font-extrabold sm:text-[1.85rem]">
        {agentCopy.directoryTitle}
      </h1>
      <div className="mt-6">
        <AgentTypeToggle filters={filters} />
      </div>
      <form
        action="/advice/agents"
        method="get"
        className="mx-auto mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        {filters.type !== 'company' ? (
          <input type="hidden" name="type" value={filters.type} />
        ) : null}
        <label className="relative min-w-0 flex-1 text-start">
          <span className="sr-only">{agentCopy.locationLabel}</span>
          <MapPin
            className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <select
            id="agent-location"
            name="location"
            defaultValue={filters.locationId ?? 'all'}
            className="h-12 w-full rounded-md border-0 bg-white pe-10 ps-4 text-sm font-semibold text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            <option value="all">كل المناطق</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-md bg-brand-500 px-8 text-sm font-extrabold text-white hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {agentCopy.searchCta}
        </button>
      </form>
    </section>
  );
}
