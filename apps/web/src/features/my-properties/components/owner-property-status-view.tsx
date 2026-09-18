import Link from 'next/link';
import Image from 'next/image';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import { cn } from '@/lib/utils/cn';
import type { ListingSubscriptionDto } from '@/types/api/listing-submission';
import type {
  ApiPropertyStatus,
  MyPropertyDto,
  OwnerPropertyStatusHistoryDto,
} from '@/types/api/my-property';
import { myPropertiesCopy } from '../config/copy';
import {
  ownerNextActionLabel,
  ownerStatusBadgeLabel,
  ownerStatusBody,
  ownerStatusTitle,
} from '../lib/status-copy';
import { OwnerStatusTimeline } from './owner-status-timeline';

interface OwnerPropertyStatusViewProps {
  property: MyPropertyDto;
  propertyTypeLabel?: string;
  history: OwnerPropertyStatusHistoryDto[];
  subscription: ListingSubscriptionDto | null;
  editHref: string;
}

function badgeTone(status: ApiPropertyStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-success-50 text-success-700';
    case 'REJECTED':
      return 'bg-danger-50 text-danger-700';
    case 'PENDING_PAYMENT':
    case 'PENDING_REVIEW':
      return 'bg-warning-50 text-warning-800';
    case 'DRAFT':
      return 'bg-brand-50 text-brand-700';
    default:
      return 'bg-surface-100 text-ink-600';
  }
}

function subscriptionStatusLabel(
  status: ListingSubscriptionDto['status'],
): string {
  switch (status) {
    case 'PENDING':
      return myPropertiesCopy.paymentPending;
    case 'ACTIVE':
      return myPropertiesCopy.paymentActive;
    case 'EXPIRED':
      return myPropertiesCopy.paymentExpired;
    case 'CANCELLED':
      return myPropertiesCopy.paymentCancelled;
    default:
      return status;
  }
}

export function OwnerPropertyStatusView({
  property,
  propertyTypeLabel,
  history,
  subscription,
  editHref,
}: OwnerPropertyStatusViewProps) {
  const status = property.status;
  const title = property.title?.trim() || 'بدون عنوان';
  const typeLabel = propertyTypeLabel?.trim() || '—';
  const price =
    property.price != null
      ? formatCurrency(property.price, property.currency || 'EGP')
      : '—';

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="grid gap-0 sm:grid-cols-[160px_minmax(0,1fr)]">
          <div className="relative h-40 bg-surface-100 sm:h-auto sm:min-h-[160px]">
            {property.primaryImageUrl ? (
              <Image
                src={property.primaryImageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="160px"
              />
            ) : (
              <span className="flex h-full min-h-[160px] items-center justify-center text-xs font-semibold text-ink-400">
                بدون صورة
              </span>
            )}
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-wide text-ink-500">
                  رقم الإعلان · <span dir="ltr">{property.id}</span>
                </p>
                <h1 className="mt-2 text-xl font-extrabold text-ink-950 sm:text-2xl">
                  {ownerStatusTitle(status)}
                </h1>
                <p className="mt-2 text-sm leading-7 text-ink-600">
                  {ownerStatusBody(status)}
                </p>
              </div>
              <span
                className={cn(
                  'inline-flex rounded px-2.5 py-1 text-xs font-bold',
                  badgeTone(status),
                )}
              >
                {ownerStatusBadgeLabel(status)}
              </span>
            </div>

            <div className="mt-4 rounded-lg bg-surface-50 px-3 py-3">
              <p className="text-xs font-semibold text-ink-500">
                {myPropertiesCopy.nextActionLabel}
              </p>
              <p className="mt-1 text-sm font-bold text-ink-900">
                {ownerNextActionLabel(status)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
        <h2 className="text-sm font-extrabold text-ink-900">
          {myPropertiesCopy.summaryTitle}
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold text-ink-500">العنوان</dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">{title}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">نوع العقار</dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">{typeLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">السعر</dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">{price}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">
              {myPropertiesCopy.lastUpdatedLabel}
            </dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">
              {formatDate(property.updatedAt)}
            </dd>
          </div>
        </dl>
      </section>

      {status === 'REJECTED' ? (
        <section className="rounded-xl border border-danger-100 bg-danger-50 p-4 sm:p-5">
          <h2 className="text-sm font-extrabold text-danger-800">
            {myPropertiesCopy.rejectionReasonTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-danger-700">
            {property.rejectedReason?.trim() ||
              'تم رفض العقار. يرجى مراجعة بيانات العقار وتعديلها ثم إعادة الإرسال.'}
          </p>
        </section>
      ) : null}

      {status === 'PENDING_PAYMENT' || subscription ? (
        <section className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
          <h2 className="text-sm font-extrabold text-ink-900">
            تفاصيل الدفع
          </h2>
          {subscription ? (
            <dl className="mt-3 space-y-2 text-sm text-ink-700">
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-ink-500">
                  {myPropertiesCopy.paymentPlanLabel}:
                </dt>
                <dd className="font-bold text-ink-900">
                  {subscription.plan.name}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-ink-500">
                  {myPropertiesCopy.paymentStatusLabel}:
                </dt>
                <dd className="font-bold text-ink-900">
                  {subscriptionStatusLabel(subscription.status)}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-ink-500">المبلغ:</dt>
                <dd className="font-bold text-ink-900">
                    {subscription.price === 0
                      ? 'مجانية'
                      : formatCurrency(subscription.price, 'EGP')}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-sm font-semibold text-ink-500">
              {myPropertiesCopy.noPlanSelected}
            </p>
          )}
        </section>
      ) : null}

      <OwnerStatusTimeline createdAt={property.createdAt} entries={history} />

      <div className="flex flex-wrap gap-2">
        {status === 'DRAFT' ? (
          <Link
            href={editHref}
            className={getButtonClassName({ className: 'font-bold' })}
          >
            {myPropertiesCopy.actions.continueDraft}
          </Link>
        ) : null}

        {status === 'PENDING_PAYMENT' ? (
          <Link
            href={routes.addProperty.step(property.id, 'checkout')}
            className={getButtonClassName({ className: 'font-bold' })}
          >
            {myPropertiesCopy.continuePayment}
          </Link>
        ) : null}

        {status === 'REJECTED' ? (
          <Link
            href={editHref}
            className={getButtonClassName({ className: 'font-bold' })}
          >
            {myPropertiesCopy.editListing}
          </Link>
        ) : null}

        {status === 'PUBLISHED' ? (
          <Link
            href={routes.listing(property.id, property.slug)}
            className={getButtonClassName({ className: 'font-bold' })}
          >
            {myPropertiesCopy.actions.view}
          </Link>
        ) : null}

        {status === 'EXPIRED' ? (
          <span
            className={getButtonClassName({
              variant: 'outline',
              className: 'cursor-not-allowed font-bold opacity-60',
            })}
            aria-disabled
          >
            {myPropertiesCopy.renewPlaceholder}
          </span>
        ) : null}

        <Link
          href={routes.myProperties}
          className={getButtonClassName({
            variant: 'outline',
            className: 'font-bold',
          })}
        >
          {myPropertiesCopy.backToMyProperties}
        </Link>
      </div>
    </div>
  );
}
