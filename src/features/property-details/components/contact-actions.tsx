import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import type { PropertySeller } from '@/types';
import { getCallHref, getWhatsAppHref } from '../lib/contact';

interface ContactActionsProps {
  seller: PropertySeller;
  message?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function ContactActions({
  seller,
  message,
  size = 'md',
  className,
}: ContactActionsProps) {
  const height =
    size === 'lg'
      ? 'h-12 min-w-[148px] px-6 text-[15px]'
      : 'h-11 min-w-[132px] px-5 text-sm';

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <a
        href={getWhatsAppHref(seller, message)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] font-bold text-white transition-colors hover:bg-[#1fb855]',
          height,
        )}
      >
        <FaWhatsapp className="size-[18px]" aria-hidden />
        {uiLabels.whatsapp}
      </a>
      <a
        href={getCallHref(seller.phone)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 font-bold text-white transition-colors hover:bg-brand-700',
          height,
        )}
      >
        <Phone className="size-4" aria-hidden />
        {uiLabels.call}
      </a>
    </div>
  );
}
