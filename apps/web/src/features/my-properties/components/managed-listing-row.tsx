'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import { getPropertyTypeLabel } from '@/config/property-types';
import { cn } from '@/lib/utils/cn';
import type { ManagedListing } from '../types';
import { myPropertiesCopy } from '../config/copy';
import {
  archiveListingAction,
  deleteDraftListingAction,
  restoreListingAction,
} from '../actions';

interface ManagedListingRowProps {
  listing: ManagedListing;
}

export function ManagedListingRow({ listing }: ManagedListingRowProps) {
  const muted =
    listing.status === 'deleted' || listing.status === 'expired';
  const typeLabel = listing.propertyType
    ? getPropertyTypeLabel(listing.propertyType)
    : null;
  const detailHref = routes.myProperty(listing.id);

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:flex-row sm:items-start sm:p-5',
        muted && 'opacity-75',
      )}
      data-testid={`listing-${listing.id}`}
    >
      <Link
        href={detailHref}
        className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-surface-100 sm:h-28 sm:w-40"
      >
        {listing.image ? (
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs font-semibold text-ink-400">
            بدون صورة
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={detailHref} className="hover:underline">
              <h3 className="text-base font-extrabold text-ink-950">
                {listing.title}
              </h3>
            </Link>
            {typeLabel ? (
              <p className="mt-1 text-sm font-semibold text-ink-600">
                {typeLabel}
                {listing.transaction
                  ? ` · ${listing.transaction === 'sale' ? 'بيع' : 'إيجار'}`
                  : ''}
              </p>
            ) : null}
            {listing.locationLabel ? (
              <p className="mt-1 text-sm text-ink-500">{listing.locationLabel}</p>
            ) : null}
          </div>
          <ManagedListingStatusBadge listing={listing} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {listing.priceEgp != null ? (
            <span className="font-bold text-ink-900">
              {formatCurrency(listing.priceEgp)}
            </span>
          ) : (
            <span className="text-ink-500">بدون سعر</span>
          )}
          <span className="text-ink-500">
            {myPropertiesCopy.lastUpdatedLabel}:{' '}
            {formatDate(listing.updatedAt ?? listing.createdAt)}
          </span>
        </div>

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

type ConfirmKind = 'delete' | 'archive' | 'restore' | null;

function ListingActions({ listing }: { listing: ManagedListing }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const [error, setError] = useState<string | null>(null);

  const viewHref = routes.listing(listing.id, listing.slug);
  const detailHref = routes.myProperty(listing.id);
  const editHref = listing.draftStep
    ? routes.addProperty.step(listing.id, listing.draftStep)
    : routes.addProperty.step(listing.id, 'basic');

  function runLifecycle(
    action: () => Promise<{ ok: boolean; error?: string }>,
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? myPropertiesCopy.actionsUnavailable);
        return;
      }
      setConfirmKind(null);
      router.refresh();
    });
  }

  const confirmCopy: Record<
    Exclude<ConfirmKind, null>,
    { title: string; description: string; label: string }
  > = {
    delete: {
      title: myPropertiesCopy.confirmDeleteTitle,
      description: myPropertiesCopy.confirmDeleteDescription,
      label: myPropertiesCopy.actions.delete,
    },
    archive: {
      title: myPropertiesCopy.confirmArchiveTitle,
      description: myPropertiesCopy.confirmArchiveDescription,
      label: myPropertiesCopy.actions.archive,
    },
    restore: {
      title: myPropertiesCopy.confirmRestoreTitle,
      description: myPropertiesCopy.confirmRestoreDescription,
      label: myPropertiesCopy.actions.restore,
    },
  };

  if (confirmKind != null) {
    return (
      <div className="w-full rounded-lg border border-[#e5e5e5] bg-surface-50 p-3 text-sm">
        <p className="font-bold text-ink-900">{confirmCopy[confirmKind].title}</p>
        <p className="mt-1 text-ink-600">{confirmCopy[confirmKind].description}</p>
        {error ? (
          <p className="mt-2 text-xs font-semibold text-danger-700">{error}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            className={getButtonClassName({
              size: 'small',
              variant: confirmKind === 'delete' ? 'danger' : 'primary',
              className: 'font-semibold',
            })}
            onClick={() => {
              if (confirmKind === 'delete') {
                runLifecycle(() => deleteDraftListingAction(listing.id));
              } else if (confirmKind === 'archive') {
                runLifecycle(() => archiveListingAction(listing.id));
              } else {
                runLifecycle(() => restoreListingAction(listing.id));
              }
            }}
          >
            {pending ? '…' : confirmCopy[confirmKind].label}
          </button>
          <button
            type="button"
            disabled={pending}
            className={getButtonClassName({
              size: 'small',
              variant: 'outline',
              className: 'font-semibold',
            })}
            onClick={() => {
              setConfirmKind(null);
              setError(null);
            }}
          >
            {myPropertiesCopy.confirmCancel}
          </button>
        </div>
      </div>
    );
  }

  if (listing.apiStatus === 'DRAFT' || listing.status === 'draft') {
    return (
      <>
        <Link
          href={editHref}
          className={getButtonClassName({
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.actions.continueDraft}
        </Link>
        <button
          type="button"
          className={getButtonClassName({
            size: 'small',
            variant: 'outline',
            className: 'font-semibold text-danger-700',
          })}
          onClick={() => setConfirmKind('delete')}
        >
          {myPropertiesCopy.actions.delete}
        </button>
      </>
    );
  }

  if (listing.apiStatus === 'PENDING_PAYMENT') {
    return (
      <>
        <Link
          href={routes.addProperty.step(listing.id, 'checkout')}
          className={getButtonClassName({
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.continuePayment}
        </Link>
        <Link
          href={detailHref}
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.viewStatus}
        </Link>
      </>
    );
  }

  if (listing.apiStatus === 'PENDING_REVIEW') {
    return (
      <Link
        href={detailHref}
        className={getButtonClassName({
          variant: 'outline',
          size: 'small',
          className: 'font-semibold',
        })}
      >
        {myPropertiesCopy.viewStatus}
      </Link>
    );
  }

  if (listing.apiStatus === 'REJECTED' || listing.status === 'rejected') {
    return (
      <>
        <Link
          href={editHref}
          className={getButtonClassName({
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.editListing}
        </Link>
        <Link
          href={detailHref}
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.viewStatus}
        </Link>
        <button
          type="button"
          className={getButtonClassName({
            size: 'small',
            variant: 'outline',
            className: 'font-semibold',
          })}
          onClick={() => setConfirmKind('archive')}
        >
          {myPropertiesCopy.actions.archive}
        </button>
      </>
    );
  }

  if (listing.apiStatus === 'PUBLISHED' || listing.status === 'published') {
    return (
      <>
        <Link
          href={viewHref}
          className={getButtonClassName({
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.actions.view}
        </Link>
        <Link
          href={detailHref}
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.viewStatus}
        </Link>
        <button
          type="button"
          className={getButtonClassName({
            size: 'small',
            variant: 'outline',
            className: 'font-semibold',
          })}
          onClick={() => setConfirmKind('archive')}
        >
          {myPropertiesCopy.actions.archive}
        </button>
      </>
    );
  }

  if (listing.apiStatus === 'EXPIRED' || listing.status === 'expired') {
    return (
      <>
        <span
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'cursor-not-allowed font-semibold opacity-60',
          })}
          aria-disabled
        >
          {myPropertiesCopy.renewPlaceholder}
        </span>
        <Link
          href={detailHref}
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.viewStatus}
        </Link>
        <button
          type="button"
          className={getButtonClassName({
            size: 'small',
            variant: 'outline',
            className: 'font-semibold',
          })}
          onClick={() => setConfirmKind('archive')}
        >
          {myPropertiesCopy.actions.archive}
        </button>
      </>
    );
  }

  if (listing.apiStatus === 'ARCHIVED' || listing.status === 'deleted') {
    return (
      <>
        <button
          type="button"
          className={getButtonClassName({
            size: 'small',
            className: 'font-semibold',
          })}
          onClick={() => setConfirmKind('restore')}
        >
          {myPropertiesCopy.actions.restore}
        </button>
        <Link
          href={editHref}
          className={getButtonClassName({
            variant: 'outline',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.actions.edit}
        </Link>
      </>
    );
  }

  return null;
}
