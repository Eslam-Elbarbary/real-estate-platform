'use client';

import { AlertTriangle, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/config/routes';
import {
  formatNumber,
  formatPrice,
  formatTypeLabel,
} from '../format';
import {
  canApproveProperty,
  canRejectProperty,
} from '../lifecycle';
import type { AdminPropertyDetails } from '../types';
import { PropertyActionMenu } from './property-action-menu';
import { PropertyStatusBadge } from './property-status-badge';

interface PropertyReviewPanelProps {
  property: AdminPropertyDetails;
  permissions: string[];
}

function collectMissingWarnings(property: AdminPropertyDetails): string[] {
  const warnings: string[] = [];

  if (!property.title?.trim()) {
    warnings.push('العنوان غير مكتمل.');
  }
  if (!property.description?.trim()) {
    warnings.push('الوصف مفقود.');
  }
  if (property.price == null) {
    warnings.push('السعر غير محدد.');
  }
  if (!property.propertyType) {
    warnings.push('نوع العقار غير محدد.');
  }
  if (!property.transactionType) {
    warnings.push('نوع المعاملة غير محدد.');
  }
  if (!property.location.area) {
    warnings.push('المنطقة غير محددة.');
  }
  if (property.areaSqm == null) {
    warnings.push('المساحة غير محددة.');
  }
  if (property.images.length === 0) {
    warnings.push('لا توجد صور مرفقة.');
  } else if (!property.images.some((image) => image.isPrimary)) {
    warnings.push('لا توجد صورة رئيسية محددة.');
  }

  return warnings;
}

export function PropertyReviewPanel({
  property,
  permissions,
}: PropertyReviewPanelProps) {
  const isPending = property.status === 'PENDING_REVIEW';
  if (!isPending) {
    return null;
  }

  const canModerate =
    canApproveProperty(property.status, permissions) ||
    canRejectProperty(property.status, permissions);

  const warnings = collectMissingWarnings(property);
  const imageCount = property.images.filter((image) => image.type === 'IMAGE').length;
  const videoCount = property.images.filter((image) => image.type === 'VIDEO').length;
  const locationLabel =
    property.location.summary ||
    [property.location.area, property.location.city, property.location.country]
      .map((ref) => formatTypeLabel(ref))
      .filter((label) => label !== '—')
      .join('، ') ||
    '—';

  return (
    <Card className="border-amber-200 bg-amber-50/70 shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200">
              <ClipboardCheck className="size-5" aria-hidden />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-ink-900">
                  هذا العقار بانتظار المراجعة
                </p>
                <PropertyStatusBadge status={property.status} />
                <Badge variant="warning">يتطلب قراراً</Badge>
              </div>
              <p className="text-sm text-ink-600">
                راجع الملخص والمالك والموقع والوسائط قبل القبول أو الرفض.
              </p>
            </div>
          </div>

          {canModerate ? (
            <PropertyActionMenu
              propertyId={property.id}
              status={property.status}
              permissions={permissions}
              showView={false}
              editHref={routes.properties.edit(property.id)}
            />
          ) : null}
        </div>

        {warnings.length > 0 ? (
          <div className="rounded-xl border border-amber-200 bg-white/80 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <AlertTriangle className="size-3.5" aria-hidden />
              تنبيهات قبل الاعتماد
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-ink-700">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm text-emerald-800">
            الحقول الأساسية مكتملة للمراجعة.
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReviewFact
            label="السعر"
            value={formatPrice(property.price, property.currency)}
          />
          <ReviewFact label="الموقع" value={locationLabel} />
          <ReviewFact
            label="المالك"
            value={property.owner.name?.trim() || property.owner.email}
          />
          <ReviewFact
            label="الوسائط"
            value={
              property.images.length === 0
                ? 'لا توجد وسائط'
                : [
                    imageCount > 0
                      ? `${formatNumber(imageCount)} صورة`
                      : null,
                    videoCount > 0
                      ? `${formatNumber(videoCount)} فيديو`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white/90 px-3 py-2">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}
