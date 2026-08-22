import Image from 'next/image';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getCallHref, getWhatsAppHref } from '@/lib/contact/phone';
import { agentCopy } from '../config';
import type { RealEstateAgent } from '../types';

interface AgentProfileHeaderProps {
  agent: RealEstateAgent;
}

export function AgentProfileHeader({ agent }: AgentProfileHeaderProps) {
  const imageSrc = agent.logoUrl ?? agent.avatarUrl;
  const typeLabel = agent.type === 'company' ? agentCopy.company : agentCopy.broker;
  const callHref = getCallHref(agent.phone);
  const whatsappHref = getWhatsAppHref(
    agent.whatsappPhone ?? agent.phone,
    `مرحباً، أود الاستفسار عن عقارات ${agent.name}`,
  );

  return (
    <header className="flex flex-col items-center gap-4 border-b border-[#ececec] pb-8 text-center sm:flex-row sm:text-start">
      <div className="relative size-20 shrink-0 overflow-hidden border border-[#ececec] bg-surface-50 sm:size-24">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            unoptimized={imageSrc.endsWith('.svg')}
            className="object-contain p-1"
            sizes="96px"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-brand-700">
          {typeLabel}
          {agent.verified ? ` · ${agentCopy.verified}` : ''}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-950">
          {agentCopy.profileTitle(agent.name)}
        </h1>
        <p className="mt-1 text-sm text-ink-600">{agent.locationLabel}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {callHref ? (
          <a
            href={callHref}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Phone className="size-4" aria-hidden />
            {agentCopy.call}
          </a>
        ) : null}
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#25D366] px-4 text-sm font-bold text-white hover:bg-[#1fb855] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <FaWhatsapp className="size-4" aria-hidden />
            {agentCopy.whatsapp}
          </a>
        ) : null}
      </div>
    </header>
  );
}
