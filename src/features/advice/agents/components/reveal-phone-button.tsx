'use client';

import { useId, useState } from 'react';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getCallHref, getWhatsAppHref } from '@/lib/contact/phone';
import { agentCopy } from '../config';
import type { RealEstateAgent } from '../types';

interface RevealPhoneButtonProps {
  agent: RealEstateAgent;
}

export function RevealPhoneButton({ agent }: RevealPhoneButtonProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const callHref = getCallHref(agent.phone);
  const whatsappHref = getWhatsAppHref(
    agent.whatsappPhone ?? agent.phone,
    `مرحباً، أود الاستفسار عن عقارات ${agent.name}`,
  );

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 min-w-[10.5rem] items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {open ? agentCopy.hidePhone : agentCopy.revealPhone}
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="رقم الهاتف"
          className="absolute start-0 z-10 mt-2 w-56 rounded-md border border-border bg-white p-3 text-start shadow-md"
        >
          <p className="text-sm font-bold text-ink-950" dir="ltr">
            {agent.phone}
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {callHref ? (
              <a
                href={callHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <Phone className="size-3.5" aria-hidden />
                {agentCopy.call}
              </a>
            ) : null}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1fb855] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <FaWhatsapp className="size-3.5" aria-hidden />
                {agentCopy.whatsapp}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
