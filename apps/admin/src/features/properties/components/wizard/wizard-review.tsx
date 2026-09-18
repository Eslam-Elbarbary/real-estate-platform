'use client';

import type { ReactNode } from 'react';
import type { MediaAsset } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import {
  formatBoolean,
  formatFinishingType,
  formatPaymentType,
  formatRentPeriod,
} from '../../format';
import {
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
} from '../../property-type-fields';
import type {
  AdminPropertyImage,
  PropertyFormCatalogs,
} from '../../types';
import type { PropertyLocationValue } from '../property-location-field';
import {
  formatContactSourceLabel,
  formatContactTypeLabel,
  type PropertyContactFormState,
} from '../property-contact-step';
import type { PropertyWizardFormState, WizardStepId } from './wizard-types';

function formatCatalogLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/70 py-2 text-sm last:border-b-0">
      <span className="text-ink-500">{label}</span>
      <span className="max-w-[65%] text-end font-medium text-ink-900">{value}</span>
    </div>
  );
}

function ReviewSection({
  title,
  stepId,
  onEdit,
  children,
}: {
  title: string;
  stepId: WizardStepId;
  onEdit: (stepId: WizardStepId) => void;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b border-border/70 bg-surface-50/70 py-3 !pb-3">
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <Button
          type="button"
          variant="outline"
          size="small"
          onClick={() => onEdit(stepId)}
        >
          تعديل
        </Button>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}

function ReviewMapPreview({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const delta = 0.018;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join('%2C');
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-border">
      <iframe
        title="معاينة الموقع"
        src={embedSrc}
        className="h-[160px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="bg-surface-50 px-2 py-1 text-xs text-ink-500" dir="ltr">
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </p>
    </div>
  );
}

function MediaReviewGallery({
  items,
}: {
  items: Array<{ id: string; url: string; isPrimary: boolean }>;
}) {
  if (items.length === 0) {
    return (
      <p className="py-2 text-sm text-ink-500">لا توجد صور مرفقة بعد.</p>
    );
  }

  const primary = items.find((item) => item.isPrimary) ?? items[0];
  const countLabel = `${items.length.toLocaleString('ar-EG')} صورة`;

  return (
    <div className="space-y-3 pt-1">
      <ReviewRow label="عدد الصور" value={countLabel} />
      {primary ? (
        <div>
          <p className="mb-1 text-xs text-ink-500">الصورة الرئيسية</p>
          <div className="overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primary.url}
              alt=""
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>
      ) : null}
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'relative overflow-hidden rounded-lg border bg-surface-50',
              item.isPrimary
                ? 'border-brand-500 ring-1 ring-brand-200'
                : 'border-border',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt=""
              className="aspect-square w-full object-cover"
            />
            {item.isPrimary ? (
              <span className="absolute inset-x-0 bottom-0 bg-brand-700/80 px-1 py-0.5 text-center text-[10px] text-white">
                رئيسية
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type WizardReviewLocationLabels = {
  country?: string | null;
  city?: string | null;
  area?: string | null;
  district?: string | null;
};

export interface WizardReviewProps {
  form: PropertyWizardFormState;
  location: PropertyLocationValue;
  catalogs: PropertyFormCatalogs;
  images: MediaAsset[];
  primaryId: string | null;
  /** Existing gallery on edit (IMAGE only shown). */
  existingImages?: AdminPropertyImage[];
  isEdit: boolean;
  reviewPrice: string;
  compoundLabel: string;
  locationLabels?: WizardReviewLocationLabels;
  propertyTypeCode?: string | null;
  isSale: boolean;
  isRent: boolean;
  contact: PropertyContactFormState;
  ownerPreview?: {
    name: string | null;
    phone: string | null;
    email?: string | null;
  } | null;
  onEditStep: (stepId: WizardStepId) => void;
}

export function WizardReview({
  form,
  location,
  catalogs,
  images,
  primaryId,
  existingImages = [],
  isEdit,
  reviewPrice,
  compoundLabel,
  locationLabels,
  propertyTypeCode,
  isSale,
  isRent,
  contact,
  ownerPreview,
  onEditStep,
}: WizardReviewProps) {
  const selectedPropertyType = catalogs.propertyTypes.find(
    (type) => type.id === form.propertyTypeId,
  );
  const selectedTransactionType = catalogs.transactionTypes.find(
    (type) => type.id === form.transactionTypeId,
  );
  const selectedFeatures = catalogs.features.filter((feature) =>
    form.featureIds.includes(feature.id),
  );
  const selectedPropertyViews = catalogs.propertyViews.filter((view) =>
    form.propertyViewIds.includes(view.id),
  );
  const selectedLegalStatus = catalogs.legalStatuses.find(
    (status) => status.id === form.legalStatusId,
  );
  const typeCode = propertyTypeCode ?? selectedPropertyType?.code ?? null;
  const detailConfig = getPropertyTypeFieldConfig(typeCode);
  const floorLabel = detailConfig.floorLabel ?? 'الدور';

  const countryLabel =
    location.countryName.trim() ||
    locationLabels?.country ||
    (location.countryId ? 'محدد' : null);
  const cityLabel =
    location.cityName.trim() ||
    locationLabels?.city ||
    (location.cityId ? 'محدد' : null);
  const areaLabel =
    location.areaName.trim() ||
    locationLabels?.area ||
    (location.areaId ? 'محدد' : null);
  const districtLabel =
    location.districtName.trim() ||
    locationLabels?.district ||
    (location.districtId ? 'محدد' : null);

  const lat = Number.parseFloat(location.latitude.trim());
  const lng = Number.parseFloat(location.longitude.trim());
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  const contactName =
    contact.contactSource === 'CUSTOM'
      ? contact.contactName.trim() || '—'
      : ownerPreview?.name?.trim() || '—';
  const contactPhone =
    contact.contactSource === 'CUSTOM'
      ? contact.phone.trim() || '—'
      : ownerPreview?.phone?.trim() || '—';
  const contactWhatsapp =
    contact.contactSource === 'CUSTOM'
      ? contact.whatsapp.trim() || null
      : ownerPreview?.phone?.trim() || null;
  const contactEmail =
    contact.contactSource === 'CUSTOM'
      ? contact.email.trim() || null
      : ownerPreview?.email?.trim() || null;

  const mediaItems = isEdit
    ? existingImages
        .filter((image) => image.type === 'IMAGE')
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((image) => ({
          id: image.id,
          url: image.url,
          isPrimary: image.isPrimary,
        }))
    : images.map((asset) => ({
        id: asset.id,
        url: asset.url,
        isPrimary: primaryId ? asset.id === primaryId : false,
      }));

  const hasVisibleDetail =
    isDetailFieldVisible('areaSqm', typeCode) ||
    (isDetailFieldVisible('bedrooms', typeCode) && Boolean(form.bedrooms.trim())) ||
    (isDetailFieldVisible('bathrooms', typeCode) && Boolean(form.bathrooms.trim())) ||
    (isDetailFieldVisible('floor', typeCode) && Boolean(form.floor.trim())) ||
    (isDetailFieldVisible('yearBuilt', typeCode) && Boolean(form.yearBuilt.trim())) ||
    (isDetailFieldVisible('finishingType', typeCode) && Boolean(form.finishingType)) ||
    (isDetailFieldVisible('propertyViews', typeCode) &&
      selectedPropertyViews.length > 0) ||
    (isDetailFieldVisible('legalStatus', typeCode) &&
      Boolean(selectedLegalStatus)) ||
    isDetailFieldVisible('furnished', typeCode);

  return (
    <section className="space-y-4">
      <p className="text-xs text-ink-500">
        راجع الأقسام التالية قبل الإرسال. يمكنك العودة لأي خطوة عبر زر تعديل.
      </p>

      <ReviewSection title="البيانات الأساسية" stepId="basic" onEdit={onEditStep}>
        <ReviewRow label="العنوان" value={form.title.trim() || '—'} />
        {form.referenceNumber.trim() ? (
          <ReviewRow label="الرقم المرجعي" value={form.referenceNumber.trim()} />
        ) : null}
        <ReviewRow
          label="نوع العقار"
          value={
            selectedPropertyType
              ? formatCatalogLabel(selectedPropertyType)
              : '—'
          }
        />
        <ReviewRow
          label="نوع المعاملة"
          value={
            selectedTransactionType
              ? formatCatalogLabel(selectedTransactionType)
              : '—'
          }
        />
        {form.description.trim() ? (
          <ReviewRow label="الوصف" value={form.description.trim()} />
        ) : null}
      </ReviewSection>

      <ReviewSection title="السعر والدفع" stepId="pricing" onEdit={onEditStep}>
        <ReviewRow
          label={isRent ? 'قيمة الإيجار' : 'السعر'}
          value={reviewPrice}
        />
        <ReviewRow label="العملة" value={form.currency.trim() || '—'} />
        {isSale ? (
          <ReviewRow
            label="طريقة الدفع"
            value={formatPaymentType(form.paymentType || null)}
          />
        ) : null}
        {isRent ? (
          <ReviewRow
            label="فترة الإيجار"
            value={formatRentPeriod(form.rentPeriod || null)}
          />
        ) : null}
        {isSale &&
        (form.paymentType === 'INSTALLMENT' ||
          form.paymentType === 'CASH_OR_INSTALLMENT') ? (
          <>
            {form.downPayment.trim() ? (
              <ReviewRow label="المقدم" value={form.downPayment.trim()} />
            ) : null}
            {form.installmentYears.trim() ? (
              <ReviewRow
                label="سنوات التقسيط"
                value={form.installmentYears.trim()}
              />
            ) : null}
            {form.monthlyInstallment.trim() ? (
              <ReviewRow
                label="القسط الشهري"
                value={form.monthlyInstallment.trim()}
              />
            ) : null}
          </>
        ) : null}
      </ReviewSection>

      <ReviewSection title="تفاصيل العقار" stepId="details" onEdit={onEditStep}>
        {isDetailFieldVisible('areaSqm', typeCode) ? (
          <ReviewRow
            label="المساحة"
            value={form.areaSqm.trim() ? `${form.areaSqm} م²` : '—'}
          />
        ) : null}
        {isDetailFieldVisible('bedrooms', typeCode) && form.bedrooms.trim() ? (
          <ReviewRow label="غرف النوم" value={form.bedrooms.trim()} />
        ) : null}
        {isDetailFieldVisible('bathrooms', typeCode) && form.bathrooms.trim() ? (
          <ReviewRow label="الحمامات" value={form.bathrooms.trim()} />
        ) : null}
        {isDetailFieldVisible('floor', typeCode) && form.floor.trim() ? (
          <ReviewRow label={floorLabel} value={form.floor.trim()} />
        ) : null}
        {isDetailFieldVisible('yearBuilt', typeCode) && form.yearBuilt.trim() ? (
          <ReviewRow label="سنة البناء" value={form.yearBuilt.trim()} />
        ) : null}
        {isDetailFieldVisible('finishingType', typeCode) && form.finishingType ? (
          <ReviewRow
            label="التشطيب"
            value={formatFinishingType(form.finishingType)}
          />
        ) : null}
        {isDetailFieldVisible('propertyViews', typeCode) &&
        selectedPropertyViews.length > 0 ? (
          <ReviewRow
            label="الإطلالات"
            value={selectedPropertyViews
              .map((view) => formatCatalogLabel(view))
              .join('، ')}
          />
        ) : null}
        {isDetailFieldVisible('legalStatus', typeCode) && selectedLegalStatus ? (
          <ReviewRow
            label="الحالة القانونية"
            value={formatCatalogLabel(selectedLegalStatus)}
          />
        ) : null}
        {isDetailFieldVisible('furnished', typeCode) ? (
          <ReviewRow label="مفروش" value={formatBoolean(form.furnished)} />
        ) : null}
        {!hasVisibleDetail ? (
          <p className="py-2 text-sm text-ink-500">
            لا توجد تفاصيل إضافية لهذا النوع.
          </p>
        ) : null}
      </ReviewSection>

      <ReviewSection title="الموقع" stepId="location" onEdit={onEditStep}>
        {countryLabel ? <ReviewRow label="الدولة" value={countryLabel} /> : null}
        {cityLabel ? <ReviewRow label="المدينة" value={cityLabel} /> : null}
        {areaLabel ? <ReviewRow label="المنطقة" value={areaLabel} /> : null}
        {districtLabel ? (
          <ReviewRow label="الحي" value={districtLabel} />
        ) : null}
        {form.compoundId ||
        location.compoundName.trim() ||
        (compoundLabel && compoundLabel !== '—') ? (
          <ReviewRow
            label="الكمبوند"
            value={
              location.compoundName.trim() || compoundLabel || '—'
            }
          />
        ) : null}
        {location.address.trim() ? (
          <ReviewRow label="العنوان" value={location.address.trim()} />
        ) : null}
        {hasCoords ? (
          <ReviewMapPreview latitude={lat} longitude={lng} />
        ) : (
          <p className="py-2 text-sm text-ink-500">لم يتم تحديد الإحداثيات.</p>
        )}
      </ReviewSection>

      <ReviewSection title="المميزات" stepId="features" onEdit={onEditStep}>
        {selectedFeatures.length > 0 ? (
          <ul className="flex flex-wrap gap-2 py-2">
            {selectedFeatures.map((feature) => (
              <li
                key={feature.id}
                className="rounded-md border border-border bg-surface-50 px-2 py-1 text-xs text-ink-800"
              >
                {feature.nameAr ?? feature.nameEn}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-2 text-sm text-ink-500">لم يتم اختيار مميزات.</p>
        )}
      </ReviewSection>

      <ReviewSection title="بيانات التواصل" stepId="contact" onEdit={onEditStep}>
        <ReviewRow
          label="المصدر"
          value={formatContactSourceLabel(contact.contactSource)}
        />
        {contact.contactSource === 'CUSTOM' && contact.contactType ? (
          <ReviewRow
            label="نوع جهة الاتصال"
            value={formatContactTypeLabel(contact.contactType)}
          />
        ) : null}
        <ReviewRow label="الاسم" value={contactName} />
        <ReviewRow label="الهاتف" value={contactPhone} />
        {contactWhatsapp ? (
          <ReviewRow label="واتساب" value={contactWhatsapp} />
        ) : null}
        {contactEmail ? (
          <ReviewRow label="البريد" value={contactEmail} />
        ) : null}
      </ReviewSection>

      <ReviewSection title="الوسائط" stepId="media" onEdit={onEditStep}>
        <MediaReviewGallery items={mediaItems} />
      </ReviewSection>
    </section>
  );
}
