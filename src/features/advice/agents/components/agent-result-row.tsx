import Image from 'next/image';
import Link from 'next/link';
import { Building2, Clock3, Users } from 'lucide-react';
import { routes } from '@/config/routes';
import { agentCopy } from '../config';
import type { RealEstateAgent } from '../types';
import { RevealPhoneButton } from './reveal-phone-button';

interface AgentResultRowProps {
  agent: RealEstateAgent;
}

export function AgentResultRow({ agent }: AgentResultRowProps) {
  const href = routes.advice.agents.profile(agent.slug);
  const imageSrc = agent.logoUrl ?? agent.avatarUrl;
  const areas = agent.serviceAreaLabels?.join('، ');

  return (
    <article
      data-testid={`agent-row-${agent.slug}`}
      className="flex flex-col gap-4 border border-[#ececec] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-4"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <Link
          href={href}
          className="relative size-[4.5rem] shrink-0 overflow-hidden border border-[#ececec] bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              unoptimized={imageSrc.endsWith('.svg')}
              className="object-contain p-1"
              sizes="72px"
            />
          ) : null}
        </Link>
        <div className="min-w-0">
          <h3 className="text-[15px] font-extrabold text-ink-950">
            <Link
              href={href}
              className="hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {agent.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs leading-5 text-ink-600">
            <span className="font-semibold text-ink-700">{agentCopy.serveAreas}</span>{' '}
            {areas || agent.locationLabel}
          </p>
        </div>
      </div>

      <ul className="grid min-w-[13rem] gap-1.5 border-y border-[#f0f0f0] py-3 text-sm text-ink-700 sm:border-x sm:border-y-0 sm:px-5 sm:py-0">
        <li className="flex items-center gap-2">
          <Clock3 className="size-3.5 shrink-0 text-ink-400" aria-hidden />
          {agent.partnershipYears
            ? agentCopy.partnership(agent.partnershipYears)
            : agent.memberSinceYear
              ? agentCopy.memberSince(agent.memberSinceYear)
              : null}
        </li>
        <li className="flex items-center gap-2">
          <Building2 className="size-3.5 shrink-0 text-ink-400" aria-hidden />
          {agentCopy.listingCount(agent.listingCount)}
        </li>
        <li className="flex items-center gap-2">
          <Users className="size-3.5 shrink-0 text-ink-400" aria-hidden />
          {agentCopy.customerCount(agent.customerCount)}
        </li>
      </ul>

      <RevealPhoneButton agent={agent} />
    </article>
  );
}
