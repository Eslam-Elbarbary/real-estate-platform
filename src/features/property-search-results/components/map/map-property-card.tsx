'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bath, BedDouble, Heart, MapPin, Phone, Ruler } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { formatArea } from '@/lib/formatting/area';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';
import { cn } from '@/lib/utils/cn';

interface MapPropertyCardProps {
  property: Property;
  active?: boolean;
  onHover?: (id: string | null) => void;
  onFocusProperty?: (id: string) => void;
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function MapPropertyCard({
  property,
  active = false,
  onHover,
  onFocusProperty,
}: MapPropertyCardProps) {
  const href = routes.listing(property.id, property.slug);
  const cover = property.images.find((image) => image.isCover) ?? property.images[0];
  const locationLabel = [property.location.areaName, property.location.cityName]
    .filter(Boolean)
    .join('، ');
  const phone = digitsOnly(property.seller.whatsapp ?? property.seller.phone ?? '');
  const whatsappHref = phone.length >= 8 ? `https://wa.me/${phone}` : null;
  const callHref = property.seller.phone ? `tel:${property.seller.phone}` : null;

  return (
    <article
      data-property-id={property.id}
      data-testid={`map-card-${property.id}`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onFocusProperty?.(property.id)}
      className={cn(
        'flex overflow-hidden rounded-lg border bg-white',
        active ? 'border-brand-600 shadow-md' : 'border-border',
      )}
    >
      <Link href={href} className="relative w-[38%] min-w-[7.5rem] shrink-0 bg-surface-100">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || property.title}
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : null}
        {property.verificationState === 'verified' ? (
          <span className="absolute top-2 end-2 rounded bg-success-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {uiLabels.verifiedBadge}
          </span>
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-2.5 py-2">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-extrabold text-ink-950">
            {formatCurrency(property.price, property.currency, property.pricingPeriod)}
          </p>
          <button
            type="button"
            aria-label={uiLabels.addFavorite}
            className="inline-flex size-7 items-center justify-center text-ink-500 hover:text-brand-700"
            onClick={(event) => event.stopPropagation()}
          >
            <Heart className="size-3.5" aria-hidden />
          </button>
        </div>
        <Link href={href} className="line-clamp-2 text-xs font-medium leading-5 text-ink-800 hover:text-brand-700">
          {property.title}
        </Link>
        <p className="flex items-center gap-1 truncate text-[11px] text-ink-500">
          <MapPin className="size-3 shrink-0" aria-hidden />
          {locationLabel}
        </p>
        <div className="mt-auto flex flex-wrap gap-x-2 text-[11px] text-ink-600">
          <span className="inline-flex items-center gap-0.5">
            <Ruler className="size-3" aria-hidden />
            {formatArea(property.area)}
          </span>
          {property.bedrooms > 0 ? (
            <span className="inline-flex items-center gap-0.5">
              <BedDouble className="size-3" aria-hidden />
              {property.bedrooms}
            </span>
          ) : null}
          {property.bathrooms > 0 ? (
            <span className="inline-flex items-center gap-0.5">
              <Bath className="size-3" aria-hidden />
              {property.bathrooms}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex gap-1">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex size-7 items-center justify-center rounded-md bg-[#25D366] text-white"
              aria-label={uiLabels.whatsapp}
            >
              <FaWhatsapp className="size-3.5" />
            </a>
          ) : null}
          {callHref ? (
            <a
              href={callHref}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex size-7 items-center justify-center rounded-md bg-brand-50 text-brand-700"
              aria-label={uiLabels.call}
            >
              <Phone className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
