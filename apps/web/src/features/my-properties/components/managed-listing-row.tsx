'use client';

import { useEffect, useId, useRef, useState, createElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { appIcons } from '@/config/icons';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import { getPropertyTypeLabel } from '@/config/property-types';
import { cn } from '@/lib/utils/cn';
import type { ManagedListing } from '../types';
import { myPropertiesCopy } from '../config/copy';

interface ManagedListingRowProps {
  listing: ManagedListing;
}

type DemoAction = 'delete' | 'restore' | 'republish' | null;

export function ManagedListingRow({ listing }: ManagedListingRowProps) {
  const [action, setAction] = useState<DemoAction>(null);
  const [toast, setToast] = useState<string | null>(null);
  const muted = listing.status === 'deleted' || listing.status === 'expired';

  function runDemoAction() {
    setAction(null);
    setToast(myPropertiesCopy.demoActionDone);
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <>
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
              <p className="mt-1 text-sm text-ink-600">{listing.locationLabel}</p>
              <p className="mt-1 text-xs text-ink-500">
                {getPropertyTypeLabel(listing.propertyType)} ·{' '}
                {listing.transaction === 'sale' ? 'بيع' : 'إيجار'}
              </p>
            </div>
            <ManagedListingStatusBadge status={listing.status} />
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
            <span className="text-ink-500">{formatDate(listing.createdAt)}</span>
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
            <ListingActions
              listing={listing}
              onDelete={() => setAction('delete')}
              onRestore={() => setAction('restore')}
              onRepublish={() => setAction('republish')}
            />
          </div>
        </div>
      </article>

      <DemoActionModal
        open={action !== null}
        title={
          action === 'delete'
            ? myPropertiesCopy.confirmDeleteTitle
            : action === 'restore'
              ? myPropertiesCopy.confirmRestoreTitle
              : myPropertiesCopy.confirmRepublishTitle
        }
        onClose={() => setAction(null)}
        onConfirm={runDemoAction}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}

function ManagedListingStatusBadge({
  status,
}: {
  status: ManagedListing['status'];
}) {
  const styles: Record<ManagedListing['status'], string> = {
    published: 'bg-success-50 text-success-700',
    pending: 'bg-warning-50 text-warning-800',
    rejected: 'bg-danger-50 text-danger-700',
    expired: 'bg-surface-100 text-ink-600',
    deleted: 'bg-surface-100 text-ink-500',
    draft: 'bg-brand-50 text-brand-700',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded px-2.5 py-1 text-xs font-bold',
        styles[status],
      )}
    >
      {myPropertiesCopy.statusBadges[status]}
    </span>
  );
}

function ListingActions({
  listing,
  onDelete,
  onRestore,
  onRepublish,
}: {
  listing: ManagedListing;
  onDelete: () => void;
  onRestore: () => void;
  onRepublish: () => void;
}) {
  const viewHref = routes.listing(listing.id, listing.slug);

  if (listing.status === 'published') {
    return (
      <>
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
        <Link
          href={routes.addListing}
          className={getButtonClassName({
            variant: 'ghost',
            size: 'small',
            className: 'font-semibold',
          })}
        >
          {myPropertiesCopy.actions.edit}
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className={getButtonClassName({
            variant: 'ghost',
            size: 'small',
            className: 'font-semibold text-danger-600',
          })}
        >
          {myPropertiesCopy.actions.delete}
        </button>
      </>
    );
  }

  if (listing.status === 'pending') {
    return (
      <span className="text-xs font-semibold text-ink-500">
        {myPropertiesCopy.statusBadges.pending}
      </span>
    );
  }

  if (listing.status === 'rejected') {
    return (
      <Link
        href={routes.addListing}
        className={getButtonClassName({
          size: 'small',
          className: 'font-semibold',
        })}
      >
        {myPropertiesCopy.actions.edit}
      </Link>
    );
  }

  if (listing.status === 'expired') {
    return (
      <button
        type="button"
        onClick={onRepublish}
        className={getButtonClassName({
          size: 'small',
          className: 'font-semibold',
        })}
      >
        {myPropertiesCopy.actions.republish}
      </button>
    );
  }

  if (listing.status === 'draft') {
    const continueHref = listing.draftStep
      ? routes.addProperty.step(listing.id, listing.draftStep)
      : listing.id.startsWith('LD-')
        ? routes.addProperty.step(listing.id, 'basic')
        : routes.addProperty.root;
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

  return (
    <button
      type="button"
      onClick={onRestore}
      className={getButtonClassName({
        variant: 'outline',
        size: 'small',
        className: 'font-semibold',
      })}
    >
      {myPropertiesCopy.actions.restore}
    </button>
  );
}

function DemoActionModal({
  open,
  title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current
      ?.querySelector<HTMLElement>('button, [href]')
      ?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/45"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-base font-extrabold text-ink-950">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-ink-600 hover:bg-surface-50"
            aria-label="إغلاق"
          >
            {createElement(appIcons.close, { size: 16, 'aria-hidden': true })}
          </button>
        </div>
        <p className="text-sm leading-7 text-ink-600">
          هذا إجراء تجريبي للعرض فقط ولن يغيّر البيانات بشكل دائم.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className={getButtonClassName({
              className: 'h-10 flex-1 font-bold',
            })}
          >
            {myPropertiesCopy.confirmContinue}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={getButtonClassName({
              variant: 'outline',
              className: 'h-10 flex-1',
            })}
          >
            {myPropertiesCopy.confirmCancel}
          </button>
        </div>
      </div>
    </div>
  );
}
