'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { getPropertyTypeLabel } from '@/config/property-types';
import { formatCurrency } from '@/lib/formatting/currency';
import { listingCopy, listingFinishingOptions } from '../../config';
import {
  getListingPublicationFee,
  resolveListingDisplayPrice,
} from '../../lib/pricing';
import type { ListingDraft } from '../../types';

interface PublishPreviewProps {
  draft: ListingDraft;
}

export function PublishPreview({ draft }: PublishPreviewProps) {
  const fee = getListingPublicationFee({
    transaction: draft.transaction,
    propertyType: draft.propertyType,
    locationId: draft.locationId,
  });
  const cover =
    draft.media.images.find((img) => img.isCover) ?? draft.media.images[0];
  const price = resolveListingDisplayPrice(draft);
  const finishingLabel = listingFinishingOptions.find(
    (o) => o.value === draft.details.finishing,
  )?.label;
  const txLabel =
    draft.transaction === 'rent' ? listingCopy.rent : listingCopy.sale;

  return (
    <div className="space-y-5">
      <article className="flex flex-col gap-4 overflow-hidden rounded-xl border border-[#e5e5e5] sm:flex-row">
        <div className="relative h-40 w-full shrink-0 bg-surface-100 sm:h-auto sm:w-48">
          {cover ? (
            <Image
              src={cover.previewUrl}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 p-4">
          <p className="text-lg font-extrabold text-ink-950">
            {price != null ? formatCurrency(price) : '—'}{' '}
            <span className="text-sm font-bold text-ink-600">{txLabel}</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
            <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden />
            {draft.locationLabel || draft.description.ar.address || '—'}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            {draft.propertyType
              ? getPropertyTypeLabel(draft.propertyType)
              : null}
            {draft.description.ar.title
              ? ` · ${draft.description.ar.title}`
              : null}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-ink-700">
            {draft.details.areaSqm != null ? (
              <li className="inline-flex items-center gap-1">
                <Ruler className="size-3.5" aria-hidden />
                {draft.details.areaSqm} متر²
              </li>
            ) : null}
            {draft.details.bedrooms != null ? (
              <li className="inline-flex items-center gap-1">
                <BedDouble className="size-3.5" aria-hidden />
                {draft.details.bedrooms} غرف
              </li>
            ) : null}
            {draft.details.bathrooms != null ? (
              <li className="inline-flex items-center gap-1">
                <Bath className="size-3.5" aria-hidden />
                {draft.details.bathrooms} حمام
              </li>
            ) : null}
            {finishingLabel ? <li>{finishingLabel}</li> : null}
          </ul>
        </div>
      </article>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-50 px-4 py-3">
        <p className="text-sm font-bold text-ink-800">
          {listingCopy.listingFeeLabel}:{' '}
          <span className="text-ink-950">
            {fee.amountEgp.toLocaleString('en-US')} جنيه
          </span>
        </p>
      </div>

      <Link
        href={routes.addProperty.step(draft.id, 'checkout')}
        className={getButtonClassName({
          className: 'inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg px-8 text-base font-extrabold',
        })}
      >
        {listingCopy.payNow}
      </Link>
    </div>
  );
}
