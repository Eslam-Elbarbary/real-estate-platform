import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import {
  formatBoolean,
  formatDate,
  formatNumber,
  formatPrice,
  formatTypeLabel,
} from '../format';
import type { AdminPropertyDetails, PublicNamedRef, PropertyFormCatalogs } from '../types';
import { PropertyActions } from './property-actions';
import { PropertyEditTrigger } from './property-edit-trigger';
import { PropertyGallery } from './property-gallery';
import { PropertyOwnerCard } from './property-owner-card';
import { PropertyStatusBadge } from './property-status-badge';
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

export function PropertyDetails({ property, catalogs, permissions }: PropertyDetailsProps) {
  const title = property.title ?? property.slug;

  return (
    <div>
      <PageHeader
        title={title}
        description={property.slug}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PropertyStatusBadge status={property.status} />
            <PropertyEditTrigger
              property={property}
              catalogs={catalogs}
              permissions={permissions}
            />
            <Link href={routes.properties.root}>
              <Button variant="outline" size="small">
                العودة للقائمة
              </Button>
            </Link>
          </div>
        }
      />

      <PropertyActions
        propertyId={property.id}
        status={property.status}
        permissions={permissions}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink-900">معلومات العقار</h2>
            </CardHeader>
            <CardContent>
              <InfoRow
                label="النوع"
                value={formatTypeLabel(property.propertyType)}
              />
              <InfoRow
                label="نوع المعاملة"
                value={formatTypeLabel(property.transactionType)}
              />
              <InfoRow
                label="السعر"
                value={formatPrice(property.price, property.currency)}
              />
              <InfoRow label="تاريخ الإرسال" value={formatDate(property.submittedAt)} />
              <InfoRow label="تاريخ النشر" value={formatDate(property.publishedAt)} />
              <InfoRow label="تاريخ المراجعة" value={formatDate(property.reviewedAt)} />
              <InfoRow
                label="المراجع"
                value={property.reviewedByName ?? '—'}
              />
              <InfoRow label="تاريخ الأرشفة" value={formatDate(property.archivedAt)} />
              <InfoRow label="تاريخ الإنشاء" value={formatDate(property.createdAt)} />
              <InfoRow
                label="آخر تحديث"
                value={formatDate(property.updatedAt)}
              />
              {property.rejectedReason ? (
                <InfoRow label="سبب الرفض" value={property.rejectedReason} />
              ) : null}
              <div className="pt-3">
                <p className="mb-1 text-sm text-ink-500">الوصف</p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-ink-800">
                  {property.description?.trim() || 'لا يوجد وصف.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink-900">المواصفات</h2>
            </CardHeader>
            <CardContent>
              <InfoRow label="غرف النوم" value={formatNumber(property.bedrooms)} />
              <InfoRow label="الحمامات" value={formatNumber(property.bathrooms)} />
              <InfoRow
                label="المساحة"
                value={formatNumber(property.areaSqm, ' م²')}
              />
              <InfoRow label="الطابق" value={formatNumber(property.floor)} />
              <InfoRow
                label="سنة البناء"
                value={formatNumber(property.yearBuilt)}
              />
              <InfoRow label="مفروش" value={formatBoolean(property.furnished)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink-900">الموقع</h2>
            </CardHeader>
            <CardContent>
              <InfoRow label="العنوان" value={property.address ?? '—'} />
              <InfoRow
                label="الملخص"
                value={property.location.summary || '—'}
              />
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
                value={property.longitude != null ? String(property.longitude) : '—'}
              />
            </CardContent>
          </Card>

          <PropertyGallery images={property.images} title={title} />

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink-900">المميزات</h2>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <PropertyOwnerCard owner={property.owner} />

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink-900">ملخص المدفوعات</h2>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <PropertyStatusHistory entries={property.statusHistory} />
        </div>
      </div>
    </div>
  );
}
