'use client';

import { useTransition } from 'react';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import type { PropertyContact } from '@/types';
import { createPropertyLeadAction } from '../actions/create-lead';
import {
  buildPropertyInterestMessage,
  getContactCallHref,
  getContactTypeLabel,
  getContactWhatsAppHref,
  hasUsableContactPhone,
} from '../lib/property-contact';

interface PropertyContactCardProps {
  propertyId: string;
  propertyTitle: string;
  contact: PropertyContact | null | undefined;
  variant?: 'card' | 'compact';
  className?: string;
}

export function PropertyContactCard({
  propertyId,
  propertyTitle,
  contact,
  variant = 'card',
  className,
}: PropertyContactCardProps) {
  const [isPending, startTransition] = useTransition();

  if (!hasUsableContactPhone(contact) || !contact) {
    return null;
  }

  const message = buildPropertyInterestMessage(propertyTitle);
  const callHref = getContactCallHref(contact.phone);
  const whatsappHref = getContactWhatsAppHref(
    contact.whatsapp || contact.phone,
    message,
  );

  if (!callHref && !whatsappHref) {
    return null;
  }

  function trackLead(type: 'PHONE' | 'WHATSAPP') {
    startTransition(() => {
      void createPropertyLeadAction(propertyId, type, message);
    });
  }

  const buttonHeight =
    variant === 'compact'
      ? 'h-12 flex-1 text-sm'
      : 'h-11 w-full text-sm sm:h-12';

  const actions = (
    <div
      className={cn(
        'flex gap-2.5',
        variant === 'compact' ? 'w-full' : 'flex-col',
      )}
    >
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLead('WHATSAPP')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] font-bold text-white transition-colors hover:bg-[#1fb855]',
            buttonHeight,
            isPending && 'opacity-90',
          )}
        >
          <FaWhatsapp className="size-[18px]" aria-hidden />
          {uiLabels.whatsapp}
        </a>
      ) : null}
      {callHref ? (
        <a
          href={callHref}
          onClick={() => trackLead('PHONE')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 font-bold text-white transition-colors hover:bg-brand-700',
            buttonHeight,
            isPending && 'opacity-90',
          )}
        >
          <Phone className="size-4" aria-hidden />
          {uiLabels.call}
        </a>
      ) : null}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={cn('flex w-full items-center gap-2.5', className)}>
        {actions}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5',
        className,
      )}
      aria-label="بيانات التواصل"
    >
      <p className="text-sm font-semibold text-ink-500">بيانات التواصل</p>
      <p className="mt-2 truncate text-lg font-bold text-ink-900">
        {contact.name.trim() || 'جهة التواصل'}
      </p>
      <p className="mt-0.5 text-sm text-ink-600">
        {getContactTypeLabel(contact.type)}
      </p>
      <div className="mt-4">{actions}</div>
      {isPending ? (
        <p className="mt-2 text-xs text-ink-400" role="status">
          جارٍ تسجيل الاهتمام…
        </p>
      ) : null}
    </aside>
  );
}
