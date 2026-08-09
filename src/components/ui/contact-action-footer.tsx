'use client';

import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { getCallHref, getWhatsAppHref } from '@/lib/contact/phone';
import { cn } from '@/lib/utils/cn';

interface ContactActionFooterProps {
  phone?: string;
  whatsapp?: string;
  message?: string;
  className?: string;
  callLabel?: string;
}

export function ContactActionFooter({
  phone,
  whatsapp,
  message,
  className,
  callLabel = uiLabels.call,
}: ContactActionFooterProps) {
  const whatsappHref = getWhatsAppHref(whatsapp ?? phone ?? '', message);
  const callHref = getCallHref(phone ?? '');

  if (!whatsappHref && !callHref) {
    return null;
  }

  return (
    <div className={cn('mt-auto flex h-12 border-t border-border', className)}>
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/[0.04]"
        >
          <FaWhatsapp className="size-[17px]" aria-hidden />
          {uiLabels.whatsapp}
        </a>
      ) : (
        <span className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-ink-400">
          <FaWhatsapp className="size-[17px]" aria-hidden />
          {uiLabels.whatsapp}
        </span>
      )}

      <span className="w-px self-stretch bg-border" aria-hidden />

      {callHref ? (
        <a
          href={callHref}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-brand-600 transition-colors hover:bg-brand-50/60"
        >
          <Phone className="size-[17px]" aria-hidden />
          {callLabel}
        </a>
      ) : (
        <span className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-ink-400">
          <Phone className="size-[17px]" aria-hidden />
          {callLabel}
        </span>
      )}
    </div>
  );
}
