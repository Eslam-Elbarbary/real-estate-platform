'use client';

import { useTransition } from 'react';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import type { PropertySeller } from '@/types';
import { createPropertyLeadAction } from '../actions/create-lead';
import {
  getCallHref,
  getWhatsAppHref,
  hasSellerPhone,
} from '../lib/contact';
import { buildPropertyInterestMessage } from '../lib/property-contact';

interface ContactActionsProps {
  propertyId?: string;
  propertyTitle?: string;
  seller: PropertySeller;
  message?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function ContactActions({
  propertyId,
  propertyTitle,
  seller,
  message,
  size = 'md',
  className,
}: ContactActionsProps) {
  const [isPending, startTransition] = useTransition();

  if (!hasSellerPhone(seller)) {
    return null;
  }

  const interestMessage =
    message ??
    (propertyTitle
      ? buildPropertyInterestMessage(propertyTitle)
      : undefined);

  const height =
    size === 'lg'
      ? 'h-12 min-w-[148px] px-6 text-[15px]'
      : 'h-11 min-w-[132px] px-5 text-sm';

  function trackLead(type: 'PHONE' | 'WHATSAPP') {
    if (!propertyId) return;
    startTransition(() => {
      void createPropertyLeadAction(propertyId, type, interestMessage);
    });
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <a
        href={getWhatsAppHref(seller, interestMessage)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackLead('WHATSAPP')}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] font-bold text-white transition-colors hover:bg-[#1fb855]',
          height,
          isPending && 'opacity-90',
        )}
      >
        <FaWhatsapp className="size-[18px]" aria-hidden />
        {uiLabels.whatsapp}
      </a>
      <a
        href={getCallHref(seller.phone)}
        onClick={() => trackLead('PHONE')}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 font-bold text-white transition-colors hover:bg-brand-700',
          height,
          isPending && 'opacity-90',
        )}
      >
        <Phone className="size-4" aria-hidden />
        {uiLabels.call}
      </a>
    </div>
  );
}
