'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { hasPermission } from '@/features/auth/permissions';
import {
  formatBoolean,
  formatDate,
  formatFinishingType,
  formatNumber,
  formatPaymentType,
  formatPrice,
  formatRentPeriod,
  formatTypeLabel,
} from '../format';
import type { AdminPropertyDetails, PublicNamedRef } from '../types';
import { PropertyActivityTimeline } from './property-activity-timeline';
import { PropertyContactCard } from './property-contact-card';
import { PropertyGallery } from './property-gallery';
import { PropertyHeader } from './property-header';
import { PropertyMediaManager } from './property-media-manager';
import { PropertyOwnerCard } from './property-owner-card';
import { PropertyReviewPanel } from './property-review-panel';
import { PropertySummaryCards } from './property-summary-cards';
import { PropertyTabs, type PropertyTabItem } from './property-tabs';
import type { PropertyContactDto } from '../api-property-contact';

interface PropertyDetailsProps {
  property: AdminPropertyDetails;
  permissions: string[];
  contact?: PropertyContactDto | null;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/80 py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium text-ink-900 sm:max-w-[70%] sm:text-end">
        {value}
      </span>
    </div>
  );
}

function locationPart(ref: PublicNamedRef | null): string {
  return formatTypeLabel(ref);
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        {description ? <p className="text-sm text-ink-500">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function LocationMap({
  latitude,
  longitude,
  title,
}: {
  latitude: number;
  longitude: number;
  title: string;
}) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02}%2C${latitude - 0.02}%2C${longitude + 0.02}%2C${latitude + 0.02}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title={`خريطة ${title}`}
        src={src}
        className="h-64 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="border-t border-border bg-surface-50 px-3 py-2 text-xs text-ink-500">
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 hover:underline"
        >
          فتح في OpenStreetMap
        </a>
      </div>
    </div>
  );
}

export function PropertyDetails({
  property,
  permissions,
  contact = null,
}: PropertyDetailsProps) {
  const router = useRouter();
  const canUpdate = hasPermission(permissions, 'properties.update');
  const title = property.title?.trim() || property.slug;
  const showInstallment =
    property.paymentType === 'INSTALLMENT' ||
    property.paymentType === 'CASH_OR_INSTALLMENT';
  const hasCoordinates =
    property.latitude != null && property.longitude != null;

  const overviewTab = (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard title="الوصف والمعلومات الأساسية">
        <InfoRow label="العنوان" value={title} />
        <InfoRow
          label="الرقم المرجعي"
          value={property.referenceNumber ?? '—'}
        />
        <InfoRow
          label="نوع العقار"
          value={formatTypeLabel(property.propertyType)}
        />
        <InfoRow
          label="نوع المعاملة"
          value={formatTypeLabel(property.transactionType)}
        />
        <div className="pt-3">
          <p className="mb-1 text-sm text-ink-500">الوصف</p>
          <p className="whitespace-pre-wrap text-sm leading-6 text-ink-800">
            {property.description?.trim() || 'لا يوجد وصف.'}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="المواصفات">
        <InfoRow label="غرف النوم" value={formatNumber(property.bedrooms)} />
        <InfoRow label="الحمامات" value={formatNumber(property.bathrooms)} />
        <InfoRow
          label="المساحة"
          value={formatNumber(property.areaSqm, ' م²')}
        />
        <InfoRow label="الدور" value={formatNumber(property.floor)} />
        <InfoRow label="سنة البناء" value={formatNumber(property.yearBuilt)} />
        <InfoRow label="مفروش" value={formatBoolean(property.furnished)} />
        <InfoRow
          label="التشطيب"
          value={formatFinishingType(property.finishingType)}
        />
      </SectionCard>

      <SectionCard title="المميزات">
        {property.features.length === 0 ? (
          <p className="text-sm text-ink-500">لا توجد مميزات مسجلة.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature) => (
              <Badge key={feature.id} variant="default">
                {feature.nameAr ?? feature.nameEn}
              </Badge>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="بيانات التشغيل">
        <InfoRow label="تاريخ الإرسال" value={formatDate(property.submittedAt)} />
        <InfoRow label="تاريخ النشر" value={formatDate(property.publishedAt)} />
        <InfoRow label="تاريخ المراجعة" value={formatDate(property.reviewedAt)} />
        <InfoRow label="المراجع" value={property.reviewedByName ?? '—'} />
        <InfoRow label="تاريخ الأرشفة" value={formatDate(property.archivedAt)} />
        {property.rejectedReason ? (
          <InfoRow label="سبب الرفض" value={property.rejectedReason} />
        ) : null}
      </SectionCard>

      <SectionCard title="الاشتراكات والمدفوعات">
        {property.subscriptions.length === 0 ? (
          <p className="mb-3 text-sm text-ink-500">لا توجد اشتراكات مرتبطة.</p>
        ) : (
          <div className="mb-4 space-y-3">
            {property.subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="text-sm font-medium text-ink-900">
                  {subscription.plan.name}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {subscription.status} ·{' '}
                  {formatPrice(subscription.price, property.currency)}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  من {formatDate(subscription.startsAt)} إلى{' '}
                  {formatDate(subscription.endsAt)}
                </p>
              </div>
            ))}
          </div>
        )}
        <InfoRow
          label="إجمالي العمليات"
          value={formatNumber(property.paymentSummary.total)}
        />
        <InfoRow
          label="ناجحة"
          value={formatNumber(property.paymentSummary.successful)}
        />
        <InfoRow
          label="معلقة"
          value={formatNumber(property.paymentSummary.pending)}
        />
        <InfoRow
          label="فاشلة"
          value={formatNumber(property.paymentSummary.failed)}
        />
        <InfoRow
          label="إجمالي المدفوع"
          value={formatPrice(
            property.paymentSummary.totalPaid,
            property.currency,
          )}
        />
      </SectionCard>
    </div>
  );

  const pricingTab = (
    <SectionCard title="السعر والدفع">
      <InfoRow
        label="السعر"
        value={formatPrice(property.price, property.currency)}
      />
      <InfoRow
        label="السعر للمتر"
        value={
          property.pricePerSqm != null
            ? formatPrice(property.pricePerSqm, property.currency)
            : '—'
        }
      />
      <InfoRow label="العملة" value={property.currency || '—'} />
      <InfoRow
        label="طريقة الدفع"
        value={formatPaymentType(property.paymentType)}
      />
      <InfoRow
        label="فترة الإيجار"
        value={formatRentPeriod(property.rentPeriod)}
      />
      {showInstallment ? (
        <>
          <InfoRow
            label="المقدم"
            value={formatPrice(property.downPayment, property.currency)}
          />
          <InfoRow
            label="سنوات التقسيط"
            value={formatNumber(property.installmentYears)}
          />
          <InfoRow
            label="القسط الشهري"
            value={formatPrice(property.monthlyInstallment, property.currency)}
          />
        </>
      ) : null}
    </SectionCard>
  );

  const locationTab = (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard title="الموقع">
        <InfoRow label="العنوان" value={property.address ?? '—'} />
        <InfoRow label="الملخص" value={property.location.summary || '—'} />
        <InfoRow
          label="الدولة"
          value={locationPart(property.location.country)}
        />
        <InfoRow label="المدينة" value={locationPart(property.location.city)} />
        <InfoRow
          label="المنطقة"
          value={locationPart(property.location.area)}
        />
        <InfoRow
          label="الحي"
          value={locationPart(property.location.district)}
        />
        <InfoRow
          label="الكمبوند"
          value={formatTypeLabel(property.compound)}
        />
        <InfoRow
          label="المطور"
          value={formatTypeLabel(property.developer)}
        />
        <InfoRow
          label="خط العرض"
          value={property.latitude != null ? String(property.latitude) : '—'}
        />
        <InfoRow
          label="خط الطول"
          value={property.longitude != null ? String(property.longitude) : '—'}
        />
      </SectionCard>

      {hasCoordinates ? (
        <SectionCard title="الخريطة">
          <LocationMap
            latitude={property.latitude!}
            longitude={property.longitude!}
            title={title}
          />
        </SectionCard>
      ) : (
        <SectionCard title="الخريطة">
          <p className="text-sm text-ink-500">
            لا تتوفر إحداثيات لعرض الخريطة.
          </p>
        </SectionCard>
      )}
    </div>
  );

  const mediaTab = canUpdate ? (
    <SectionCard
      title="إدارة الوسائط"
      description="إضافة، ترتيب، تعيين رئيسية، أو حذف دون التأثير على بيانات العقار الأخرى."
    >
      <PropertyMediaManager
        propertyId={property.id}
        initialImages={property.images}
        permissions={permissions}
        title="الوسائط"
        onChanged={() => {
          void router.refresh();
        }}
      />
    </SectionCard>
  ) : (
    <SectionCard title="الوسائط">
      <p className="text-sm text-ink-500">
        ليس لديك صلاحية إدارة وسائط هذا العقار.
      </p>
      <p className="mt-2 text-sm text-ink-600">
        الصور:{' '}
        {formatNumber(
          property.images.filter((image) => image.type === 'IMAGE').length,
        )}{' '}
        · الفيديو:{' '}
        {formatNumber(
          property.images.filter((image) => image.type === 'VIDEO').length,
        )}
      </p>
    </SectionCard>
  );

  const tabs: PropertyTabItem[] = [
    { id: 'overview', label: 'نظرة عامة', content: overviewTab },
    { id: 'pricing', label: 'السعر والدفع', content: pricingTab },
    { id: 'location', label: 'الموقع', content: locationTab },
    {
      id: 'owner',
      label: 'المالك',
      content: <PropertyOwnerCard owner={property.owner} />,
    },
    { id: 'media', label: 'الوسائط', content: mediaTab },
    {
      id: 'activity',
      label: 'النشاط',
      content: (
        <PropertyActivityTimeline
          entries={property.statusHistory}
          createdAt={property.createdAt}
          updatedAt={property.updatedAt}
          publishedAt={property.publishedAt}
          archivedAt={property.archivedAt}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PropertyHeader property={property} permissions={permissions} />
      <PropertyReviewPanel property={property} permissions={permissions} />
      <PropertySummaryCards property={property} />
      <PropertyContactCard
        property={property}
        permissions={permissions}
        initialContact={contact}
      />
      <PropertyGallery images={property.images} title={title} />
      <PropertyTabs tabs={tabs} />
    </div>
  );
}
