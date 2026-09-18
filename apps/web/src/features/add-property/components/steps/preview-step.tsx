'use client';

import { useTransition, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { LocationMap } from '@/features/property-details/components/location-map';
import { PropertyGallery } from '@/features/property-details/components/property-gallery';
import type { LocationOption } from '@/features/locations';
import type {
  CatalogFeatureDto,
  CatalogTypeDto,
} from '@/types/api/public-property';
import { cn } from '@/lib/utils/cn';
import { continuePreviewStepAction } from '../../actions';
import { listingCopy } from '../../config';
import {
  formatPaymentTypeLabel,
  formatRentPeriodLabel,
  showsInstallmentFields,
} from '../../lib/pricing';
import {
  buildPreviewGalleryImages,
  buildPreviewSummaryRows,
  buildPreviewTitle,
  propertyTypeLabel,
  resolvePreviewFeatureLabels,
  resolvePreviewLocation,
  transactionLabel,
} from '../../lib/preview-from-draft';
import type { ListingDraft } from '../../types';

interface PreviewStepProps {
  draft: ListingDraft;
  features: CatalogFeatureDto[];
  locations: LocationOption[];
  propertyViews?: CatalogTypeDto[];
  legalStatuses?: CatalogTypeDto[];
}

function EditLink({
  draftId,
  step,
}: {
  draftId: string;
  step:
    | 'basic'
    | 'details'
    | 'price'
    | 'description'
    | 'contact'
    | 'media';
}) {
  return (
    <Link
      href={routes.addProperty.step(draftId, step)}
      className="inline-flex h-9 shrink-0 items-center rounded-md border border-[#d9d9d9] bg-white px-3 text-sm font-bold text-brand-700 hover:bg-surface-50"
    >
      {listingCopy.previewEdit}
    </Link>
  );
}

function SectionCard({
  title,
  edit,
  children,
  className,
}: {
  title: string;
  edit?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-[#e5e5e5] bg-white px-4 py-4 sm:px-5 sm:py-5',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-extrabold text-ink-900">{title}</h2>
        {edit}
      </div>
      {children}
    </section>
  );
}

function contactTypeLabel(type: ListingDraft['contact']['contactType']): string {
  switch (type) {
    case 'AGENT':
      return listingCopy.contactTypeAgent;
    case 'COMPANY':
      return listingCopy.contactTypeCompany;
    default:
      return listingCopy.contactTypeOwner;
  }
}

export function PreviewStep({
  draft,
  features,
  locations,
  propertyViews,
  legalStatuses,
}: PreviewStepProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const title = buildPreviewTitle(draft);
  const images = buildPreviewGalleryImages(draft);
  const summaryRows = buildPreviewSummaryRows(draft, {
    propertyViews,
    legalStatuses,
  });
  const featureLabels = resolvePreviewFeatureLabels(draft, features);
  const { lines: locationLines, mapLocation } = resolvePreviewLocation(
    draft,
    locations,
  );
  const pricing = draft.pricing;
  const isRent = draft.transaction === 'rent';
  const description =
    draft.description.ar.description.trim() ||
    draft.description.en.description.trim();
  const contact = draft.contact;
  const contactName =
    contact.contactName.trim() ||
    (contact.contactSource === 'OWNER' ? 'حسابي' : '—');
  const phone = contact.phone.trim();
  const whatsapp = contact.whatsapp.trim() || phone;

  function onContinue() {
    startTransition(async () => {
      const result = await continuePreviewStepAction(draft.id);
      if (!result.ok) return;
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eee] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-600">
              {propertyTypeLabel(draft)} · {transactionLabel(draft)}
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-ink-950 sm:text-xl">
              {title}
            </h2>
            {images.length > 0 ? (
              <p className="mt-1 text-xs font-semibold text-ink-500">
                {images.length} صورة
              </p>
            ) : null}
          </div>
          <EditLink draftId={draft.id} step="media" />
        </div>
        <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
          {images.length > 0 ? (
            <PropertyGallery images={images} title={title} />
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#d9d9d9] bg-surface-50 px-4 text-center sm:h-[260px]">
              <p className="text-sm font-semibold text-ink-500">
                {listingCopy.previewMissingMedia}
              </p>
              <EditLink draftId={draft.id} step="media" />
            </div>
          )}
        </div>
      </section>

      {/* Price */}
      <SectionCard
        title="السعر"
        edit={<EditLink draftId={draft.id} step="price" />}
      >
        {pricing.price != null ? (
          <p className="text-2xl font-extrabold text-brand-700">
            {pricing.price.toLocaleString('en-US')}{' '}
            <span className="text-base font-bold text-ink-700">
              {pricing.currency || 'EGP'}
            </span>
          </p>
        ) : (
          <p className="text-sm font-semibold text-ink-500">لم يُحدد السعر بعد.</p>
        )}
        <div className="mt-3 space-y-1.5 text-sm text-ink-700">
          {isRent ? (
            <p>
              فترة الإيجار:{' '}
              <span className="font-semibold text-ink-900">
                {formatRentPeriodLabel(pricing.rentPeriod)}
              </span>
            </p>
          ) : (
            <>
              <p>
                طريقة الدفع:{' '}
                <span className="font-semibold text-ink-900">
                  {formatPaymentTypeLabel(pricing.paymentType)}
                </span>
              </p>
              {showsInstallmentFields(pricing.paymentType) ? (
                <>
                  <p>
                    المقدم:{' '}
                    <span className="font-semibold text-ink-900">
                      {pricing.downPayment != null
                        ? pricing.downPayment.toLocaleString('en-US')
                        : '—'}
                    </span>
                  </p>
                  <p>
                    مدة التقسيط:{' '}
                    <span className="font-semibold text-ink-900">
                      {pricing.installmentYears != null
                        ? `${pricing.installmentYears} سنوات`
                        : '—'}
                    </span>
                  </p>
                  <p>
                    القسط الشهري:{' '}
                    <span className="font-semibold text-ink-900">
                      {pricing.monthlyInstallment != null
                        ? pricing.monthlyInstallment.toLocaleString('en-US')
                        : '—'}
                    </span>
                  </p>
                </>
              ) : null}
            </>
          )}
        </div>
      </SectionCard>

      {/* Summary */}
      <SectionCard
        title="ملخص العقار"
        edit={<EditLink draftId={draft.id} step="details" />}
      >
        {summaryRows.length > 0 ? (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {summaryRows.map((row) => (
              <div
                key={row.key}
                className="rounded-lg bg-surface-50 px-3 py-2.5"
              >
                <dt className="text-xs font-semibold text-ink-500">{row.label}</dt>
                <dd className="mt-1 text-sm font-extrabold text-ink-900">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm font-semibold text-ink-500">
            لا توجد تفاصيل لعرضها لهذا النوع.
          </p>
        )}
      </SectionCard>

      {/* Description */}
      <SectionCard
        title="الوصف"
        edit={<EditLink draftId={draft.id} step="description" />}
      >
        {description ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-ink-700">
            {description}
          </p>
        ) : (
          <p className="text-sm font-semibold text-ink-500">لا يوجد وصف بعد.</p>
        )}
      </SectionCard>

      {/* Features */}
      <SectionCard
        title="المزايا"
        edit={<EditLink draftId={draft.id} step="details" />}
      >
        {featureLabels.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {featureLabels.map((label) => (
              <li
                key={label}
                className="rounded-full border border-[#e5e5e5] bg-surface-50 px-3 py-1.5 text-xs font-bold text-ink-800"
              >
                {label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-semibold text-ink-500">
            {listingCopy.previewMissingFeatures}
          </p>
        )}
      </SectionCard>

      {/* Location */}
      <SectionCard
        title="الموقع"
        edit={<EditLink draftId={draft.id} step="basic" />}
      >
        {locationLines.length > 1 || draft.locationLabel ? (
          <dl className="space-y-2 text-sm text-ink-700">
            {locationLines.map((line) => (
              <div
                key={line.label}
                className="flex flex-wrap items-baseline gap-2"
              >
                <dt className="font-semibold text-ink-500">{line.label}:</dt>
                <dd className="font-bold text-ink-900">{line.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm font-semibold text-ink-500">
            {listingCopy.previewMissingLocation}
          </p>
        )}
        {mapLocation ? (
          <div className="mt-4 [&_section]:pt-0 [&_h2]:hidden">
            <LocationMap location={mapLocation} />
          </div>
        ) : null}
      </SectionCard>

      {/* Contact — no email */}
      <SectionCard
        title={listingCopy.contactReviewTitle}
        edit={<EditLink draftId={draft.id} step="contact" />}
      >
        {phone ? (
          <div className="space-y-1.5 text-sm text-ink-700">
            <p className="text-base font-extrabold text-ink-900">{contactName}</p>
            <p>
              {contact.contactSource === 'OWNER'
                ? listingCopy.contactTypeOwner
                : contactTypeLabel(contact.contactType)}
            </p>
            <p dir="ltr">الهاتف: {phone}</p>
            <p dir="ltr">واتساب: {whatsapp || '—'}</p>
          </div>
        ) : (
          <p className="text-sm font-semibold text-ink-500">
            {listingCopy.previewMissingContact}
          </p>
        )}
      </SectionCard>

      {/* Cover thumb strip for mobile context when gallery is long */}
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {images.slice(0, 8).map((image) => (
            <div
              key={image.id}
              className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-[#e5e5e5]"
            >
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="sticky bottom-3 z-10 rounded-xl border border-[#e5e5e5] bg-white/95 p-3 shadow-sm backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <button
          type="button"
          disabled={pending}
          onClick={onContinue}
          className={getButtonClassName({
            className:
              'h-12 w-full rounded-lg px-8 text-base font-extrabold sm:w-auto sm:min-w-[180px]',
          })}
        >
          {listingCopy.previewContinue}
        </button>
      </div>
    </div>
  );
}
