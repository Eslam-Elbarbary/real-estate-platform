'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatArea } from '@/lib/formatting/area';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import { getPropertyTypeLabel } from '@/config/property-types';
import { cn } from '@/lib/utils/cn';
import type { ManagedListing } from '../types';
import { myPropertiesCopy } from '../config/copy';

interface ManagedListingRowProps {
  listing: ManagedListing;
}

export function ManagedListingRow({ listing }: ManagedListingRowProps) {
  const muted = listing.status === 'deleted' || listing.status === 'expired';
  const typeParts = [
    listing.propertyType ? getPropertyTypeLabel(listing.propertyType) : null,
    listing.transaction
      ? listing.transaction === 'sale'
        ? 'بيع'
        : 'إيجار'
      : null,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:flex-row sm:items-start sm:p-5',
        muted && 'opacity-75',
      )}
      data-testid={`listing-${listing.id}`}
    >
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-surface-100 sm:h-28 sm:w-40">
        {listing.image ? (
          <Image
            src={listing.image}
            alt=""
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-ink-950">
              {listing.title}
            </h3>
            {listing.locationLabel ? (
              <p className="mt-1 text-sm text-ink-600">{listing.locationLabel}</p>
            ) : null}
            {typeParts.length > 0 ? (
              <p className="mt-1 text-xs text-ink-500">{typeParts.join(' · ')}</p>
            ) : null}
          </div>
          <ManagedListingStatusBadge listing={listing} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {listing.priceEgp != null ? (
            <span className="font-bold text-ink-900">
              {formatCurrency(listing.priceEgp)}
            </span>
          ) : null}
          <span className="text-ink-500">
            {myPropertiesCopy.listingIdLabel}:{' '}
            <span dir="ltr">{listing.id}</span>
          </span>
          <span className="text-ink-500">
            {formatDate(listing.publishedAt ?? listing.createdAt)}
          </span>
          {listing.areaSqm != null && listing.areaSqm > 0 ? (
            <span className="text-ink-500">{formatArea(listing.areaSqm)}</span>
          ) : null}
          {listing.bedrooms != null && listing.bedrooms > 0 ? (
            <span className="text-ink-500">{listing.bedrooms} غرف</span>
          ) : null}
          {listing.bathrooms != null && listing.bathrooms > 0 ? (
            <span className="text-ink-500">{listing.bathrooms} حمام</span>
          ) : null}
        </div>

        {(listing.views != null || listing.contacts != null) && (
          <p className="mt-2 text-xs text-ink-500">
            {listing.views != null
              ? `${myPropertiesCopy.viewsLabel}: ${listing.views.toLocaleString('en-US')}`
              : null}
            {listing.views != null && listing.contacts != null ? ' · ' : null}
            {listing.contacts != null
              ? `${myPropertiesCopy.contactsLabel}: ${listing.contacts.toLocaleString('en-US')}`
              : null}
          </p>
        )}

        {listing.rejectionReason ? (
          <p className="mt-2 rounded-md bg-danger-50 px-3 py-2 text-xs leading-6 text-danger-700">
            {listing.rejectionReason}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <ListingActions listing={listing} />
        </div>
      </div>
    </article>
  );
}

function ManagedListingStatusBadge({
  listing,
}: {
  listing: ManagedListing;
}) {
  const styles: Record<ManagedListing['status'], string> = {
    published: 'bg-success-50 text-success-700',
    pending: 'bg-warning-50 text-warning-800',
    rejected: 'bg-danger-50 text-danger-700',
    expired: 'bg-surface-100 text-ink-600',
    deleted: 'bg-surface-100 text-ink-500',
    draft: 'bg-brand-50 text-brand-700',
  };

  const label =
    listing.apiStatus === 'PENDING_PAYMENT'
      ? myPropertiesCopy.pendingPaymentBadge
      : listing.apiStatus === 'PENDING_REVIEW'
        ? myPropertiesCopy.pendingReviewBadge
        : myPropertiesCopy.statusBadges[listing.status];

  return (
    <span
      className={cn(
        'inline-flex rounded px-2.5 py-1 text-xs font-bold',
        styles[listing.status],
      )}
    >
      {label}
    </span>
  );
}

function ListingActions({ listing }: { listing: ManagedListing }) {
  const viewHref = routes.listing(listing.id, listing.slug);

  if (listing.status === 'published') {
    return (
      <Link
        href={viewHref}
        className={getButtonClassName({
          variant: 'outline',
          size: 'small',
          className: 'font-semibold',
        })}
      >
        {myPropertiesCopy.actions.view}
      </Link>
    );
  }

  if (listing.apiStatus === 'PENDING_PAYMENT') {
    return (
      <Link
        href={routes.addProperty.step(listing.id, 'checkout')}
        className={getButtonClassName({
          size: 'small',
          className: 'font-semibold',
        })}
      >
        {myPropertiesCopy.continuePayment}
      </Link>
    );
  }

  if (listing.apiStatus === 'PENDING_REVIEW' || listing.status === 'pending') {
    return (
      <span className="text-xs font-semibold text-ink-500">
        {myPropertiesCopy.pendingReviewBadge}
      </span>
    );
  }

  if (listing.status === 'draft') {
    const continueHref = listing.draftStep
      ? routes.addProperty.step(listing.id, listing.draftStep)
      : routes.addProperty.step(listing.id, 'basic');
    return (
      <Link
        href={continueHref}
        className={getButtonClassName({
          size: 'small',
          className: 'font-semibold',
        })}
      >
        {myPropertiesCopy.actions.continueDraft}
      </Link>
    );
  }

  if (listing.status === 'rejected') {
    return (
      <>
        <Link
          href={routes.addProperty.step(listing.id, 'basic')}
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.actions.edit}
        </Link>
        <Link
          href={routes.addProperty.step(listing.id, 'publish')}
          className={getButtonClassName({
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.continueResubmit}
        </Link>
      </>
    );
  }

  return null;
}
