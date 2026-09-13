'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
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
import type {
  AdminPropertyDetails,
  PublicNamedRef,
  PropertyFormCatalogs,
} from '../types';
import { PropertyActionMenu } from './property-action-menu';
import { PropertyEditDialog } from './property-edit-dialog';
import { PropertyGallery } from './property-gallery';
import { PropertyMediaManager } from './property-media-manager';
import { PropertyOwnerCard } from './property-owner-card';
import { PropertyStatusBadge, PROPERTY_STATUS_CONFIG } from './property-status-badge';
import { PropertyStatusHistory } from './property-status-history';

interface PropertyDetailsProps {
  property: AdminPropertyDetails;
  catalogs: PropertyFormCatalogs;
  permissions: string[];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
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
  children: React.ReactNode;
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

export function PropertyDetails({
  property,
  catalogs,
  permissions,
}: PropertyDetailsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const canUpdate = hasPermission(permissions, 'properties.update');
  const title = property.title ?? property.slug;
  const showInstallment =
    property.paymentType === 'INSTALLMENT' ||
    property.paymentType === 'CASH_OR_INSTALLMENT';

  return (
    <div>
      <PageHeader
        title={title}
        description={[
          property.referenceNumber,
          `أُنشئ ${formatDate(property.createdAt)}`,
          property.publishedAt ? `نُشر ${formatDate(property.publishedAt)}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PropertyStatusBadge status={property.status} />
            <PropertyActionMenu
              propertyId={property.id}
              status={property.status}
              permissions={permissions}
              showView={false}
              onEdit={canUpdate ? () => setEditOpen(true) : undefined}
            />
            <Link href={routes.properties.root}>
              <Button variant="outline" size="small">
                العودة للقائمة
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <SectionCard title="نظرة عامة">
            <InfoRow label="العنوان" value={title} />
            <InfoRow
              label="الرقم المرجعي"
              value={property.referenceNumber ?? '—'}
            />
            <InfoRow
              label="الحالة"
              value={PROPERTY_STATUS_CONFIG[property.status]?.label ?? property.status}
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

          <SectionCard title="التسعير والدفع">
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
                  value={formatPrice(
                    property.monthlyInstallment,
                    property.currency,
                  )}
                />
              </>
            ) : null}
          </SectionCard>

          <SectionCard title="مواصفات العقار">
            <InfoRow label="غرف النوم" value={formatNumber(property.bedrooms)} />
            <InfoRow label="الحمامات" value={formatNumber(property.bathrooms)} />
            <InfoRow
              label="المساحة"
              value={formatNumber(property.areaSqm, ' م²')}
            />
            <InfoRow label="الدور" value={formatNumber(property.floor)} />
            <InfoRow
              label="سنة البناء"
              value={formatNumber(property.yearBuilt)}
            />
            <InfoRow label="مفروش" value={formatBoolean(property.furnished)} />
            <InfoRow
              label="التشطيب"
              value={formatFinishingType(property.finishingType)}
            />
          </SectionCard>

          <SectionCard title="الموقع">
            <InfoRow label="العنوان" value={property.address ?? '—'} />
            <InfoRow label="الملخص" value={property.location.summary || '—'} />
            <InfoRow
              label="الدولة"
              value={locationPart(property.location.country)}
            />
            <InfoRow
              label="المدينة"
              value={locationPart(property.location.city)}
            />
            <InfoRow
              label="المنطقة"
              value={locationPart(property.location.area)}
            />
            <InfoRow
              label="الحي"
              value={locationPart(property.location.district)}
            />
            <InfoRow
              label="خط العرض"
              value={property.latitude != null ? String(property.latitude) : '—'}
            />
            <InfoRow
              label="خط الطول"
              value={
                property.longitude != null ? String(property.longitude) : '—'
              }
            />
          </SectionCard>

          <SectionCard title="الكمبوند / المطور">
            <InfoRow
              label="الكمبوند"
              value={formatTypeLabel(property.compound)}
            />
            <InfoRow
              label="المطور"
              value={formatTypeLabel(property.developer)}
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

          <PropertyGallery images={property.images} title={title} />

          {canUpdate ? (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-ink-900">
                  إدارة الوسائط
                </h2>
                <p className="text-sm text-ink-500">
                  إضافة، ترتيب، تعيين رئيسية، أو حذف دون التأثير على بيانات العقار الأخرى.
                </p>
              </CardHeader>
              <CardContent>
                <PropertyMediaManager
                  propertyId={property.id}
                  initialImages={property.images}
                  permissions={permissions}
                  title="الوسائط"
                  onChanged={() => {
                    void router.refresh();
                  }}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <PropertyOwnerCard owner={property.owner} />

          <SectionCard title="الإحصائيات">
            <InfoRow label="المشاهدات" value={formatNumber(property.viewCount)} />
            <InfoRow
              label="المفضلة"
              value={formatNumber(property.favoritesCount)}
            />
            <InfoRow
              label="الصور"
              value={formatNumber(
                property.images.filter((image) => image.type === 'IMAGE').length,
              )}
            />
            <InfoRow
              label="الفيديو"
              value={formatNumber(
                property.images.filter((image) => image.type === 'VIDEO').length,
              )}
            />
          </SectionCard>

          <SectionCard title="المراجعة">
            <InfoRow label="تاريخ الإرسال" value={formatDate(property.submittedAt)} />
            <InfoRow label="تاريخ النشر" value={formatDate(property.publishedAt)} />
            <InfoRow label="تاريخ المراجعة" value={formatDate(property.reviewedAt)} />
            <InfoRow label="المراجع" value={property.reviewedByName ?? '—'} />
            <InfoRow label="تاريخ الأرشفة" value={formatDate(property.archivedAt)} />
            <InfoRow label="تاريخ الإنشاء" value={formatDate(property.createdAt)} />
            <InfoRow label="آخر تحديث" value={formatDate(property.updatedAt)} />
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

          <PropertyStatusHistory entries={property.statusHistory} />
        </div>
      </div>

      <PropertyEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        property={property}
        catalogs={catalogs}
        permissions={permissions}
        onSuccess={() => {
          void router.refresh();
        }}
      />
    </div>
  );
}
