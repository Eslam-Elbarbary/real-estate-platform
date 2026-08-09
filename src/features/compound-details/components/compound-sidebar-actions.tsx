'use client';

import { Share2, Download } from 'lucide-react';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { getCallHref, getWhatsAppHref } from '@/lib/contact/phone';
import { cn } from '@/lib/utils/cn';

interface CompoundSidebarActionsProps {
  title: string;
  phone?: string;
  whatsapp?: string;
  brochureUrl?: string;
  className?: string;
}

export function CompoundSidebarActions({
  title,
  phone,
  whatsapp,
  brochureUrl,
  className,
}: CompoundSidebarActionsProps) {
  const whatsappHref = getWhatsAppHref(
    whatsapp ?? phone ?? '',
    `مرحبا، أنا مهتم بمشروع ${title}`,
  );
  const callHref = getCallHref(phone ?? '');

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      // User cancelled share or clipboard unavailable.
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-white text-[13px] font-semibold text-ink-800 transition hover:bg-surface-50"
        >
          <Share2 className="size-4" aria-hidden />
          {uiLabels.compoundDetailsShare}
        </button>
        {brochureUrl ? (
          <a
            href={brochureUrl}
            download
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-white text-[13px] font-semibold text-ink-800 transition hover:bg-surface-50"
          >
            <Download className="size-4" aria-hidden />
            {uiLabels.compoundDetailsBrochure}
          </a>
        ) : (
          <span className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface-50 text-[13px] font-semibold text-ink-400">
            <Download className="size-4" aria-hidden />
            {uiLabels.compoundDetailsBrochure}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] text-[14px] font-bold text-white transition hover:bg-[#1fb855]"
          >
            <FaWhatsapp className="size-[18px]" aria-hidden />
            {uiLabels.whatsapp}
          </a>
        ) : null}
        {callHref ? (
          <a
            href={callHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 text-[14px] font-bold text-white transition hover:bg-brand-700"
          >
            <Phone className="size-4" aria-hidden />
            {uiLabels.call}
          </a>
        ) : null}
      </div>
    </div>
  );
}
