'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bath, BedDouble, Heart, Images, MapPin, Phone, Ruler } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { formatArea } from '@/lib/formatting/area';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';
import { cn } from '@/lib/utils/cn';

interface PropertyCardProps {
  property: Property;
  className?: string;
  /** Search Results footer with WhatsApp / Call. Off by default for reuse. */
  showContactActions?: boolean;
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

function getSellerWhatsAppHref(property: Property): string | null {
  const raw = property.seller.whatsapp ?? property.seller.phone;
  const phone = digitsOnly(raw ?? '');
  if (phone.length < 8) {
    return null;
  }

  return `https://wa.me/${phone}`;
}

function getSellerCallHref(property: Property): string | null {
  const phone = property.seller.phone?.trim();
  if (!phone) {
    return null;
  }

  return `tel:${phone}`;
}

export function PropertyCard({
  property,
  className,
  showContactActions = false,
}: PropertyCardProps) {
  const [favorite, setFavorite] = useState(false);
  const href = routes.listing(property.id, property.slug);
  const cover =
    property.images.find((image) => image.isCover) ?? property.images[0];
  const imageCount = property.images.length;
  const locationParts = [property.location.areaName, property.location.cityName].filter(
    Boolean,
  );
  const locationLabel = [...new Set(locationParts)].join('، ');
  const whatsappHref = showContactActions ? getSellerWhatsAppHref(property) : null;
  const callHref = showContactActions ? getSellerCallHref(property) : null;
  const showFooter = showContactActions && (whatsappHref || callHref);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      {/* ~1.5 width/height → taller dominant image on wide desktop cards */}
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-100 xl:min-h-[250px]">
        <Link href={href} className="absolute inset-0" tabIndex={-1}>
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt || property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
        </Link>

        <button
          type="button"
          onClick={() => setFavorite((current) => !current)}
          aria-label={favorite ? uiLabels.removeFavorite : uiLabels.addFavorite}
          className="absolute top-3 start-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/95 text-ink-700 shadow-sm transition-colors hover:text-brand-700"
        >
          <Heart
            className={cn('size-[18px]', favorite && 'fill-brand-600 text-brand-600')}
            aria-hidden
          />
        </button>

        {property.verificationState === 'verified' ? (
          <span className="absolute top-3 end-3 z-10 rounded bg-success-700 px-2.5 py-1 text-xs font-bold text-white">
            {uiLabels.verifiedBadge}
          </span>
        ) : null}

        {imageCount > 1 ? (
          <span className="absolute bottom-3 end-3 z-10 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur-[1px]">
            <Images className="size-3.5" aria-hidden />
            {imageCount}
          </span>
        ) : null}

        {imageCount > 1 ? (
          <div className="absolute inset-x-0 bottom-2.5 z-10 flex items-center justify-center gap-1.5">
            {property.images.slice(0, 5).map((image, index) => (
              <span
                key={image.id}
                className={cn(
                  'size-1.5 rounded-full',
                  index === 0 ? 'bg-white' : 'bg-white/50',
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[17px] font-bold leading-none text-ink-950 sm:text-lg">
            {formatCurrency(property.price, property.currency)}
          </p>
          <p className="shrink-0 text-xs text-ink-500 sm:text-[13px]">
            {formatCurrency(property.pricePerSqm, property.currency)}/م²
          </p>
        </div>

        <Link
          href={href}
          className="line-clamp-2 text-[13px] font-medium leading-5 text-ink-800 hover:text-brand-700 sm:text-sm sm:leading-6"
        >
          {property.title}
        </Link>

        <p className="flex items-center gap-1 truncate text-[12px] text-ink-500">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {locationLabel}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[12px] text-ink-600">
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5 text-ink-400" aria-hidden />
            {formatArea(property.area)}
          </span>
          {property.bedrooms > 0 ? (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5 text-ink-400" aria-hidden />
              {property.bedrooms} {uiLabels.bedroomsShort}
            </span>
          ) : null}
          {property.bathrooms > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5 text-ink-400" aria-hidden />
              {property.bathrooms} {uiLabels.bathroomsShort}
            </span>
          ) : null}
        </div>
      </div>

      {showFooter ? (
        <div className="mt-auto flex h-[52px] border-t border-border">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/[0.04]"
            >
              <FaWhatsapp className="size-[18px]" aria-hidden />
              {uiLabels.whatsapp}
            </a>
          ) : (
            <span className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-ink-400">
              <FaWhatsapp className="size-[18px]" aria-hidden />
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
              <Phone className="size-[18px]" aria-hidden />
              {uiLabels.call}
            </a>
          ) : (
            <span className="inline-flex flex-1 items-center justify-center gap-1.5 text-[13px] font-semibold text-ink-400">
              <Phone className="size-[18px]" aria-hidden />
              {uiLabels.call}
            </span>
          )}
        </div>
      ) : null}
    </article>
  );
}
