'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatTypeLabel } from '../format';
import { canEditProperty } from '../lifecycle';
import type { AdminPropertyDetails } from '../types';
import { PropertyActionMenu } from './property-action-menu';
import { PropertyStatusBadge } from './property-status-badge';

interface PropertyHeaderProps {
  property: AdminPropertyDetails;
  permissions: string[];
  className?: string;
}

export function PropertyHeader({
  property,
  permissions,
  className,
}: PropertyHeaderProps) {
  const title = property.title?.trim() || property.slug;
  const editAllowed = canEditProperty(property.status, permissions);
  const editHref = routes.properties.edit(property.id);

  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90',
        className,
      )}
    >
      <div className="flex flex-col gap-4 px-1 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={routes.properties.root}
              className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-800"
            >
              <ArrowRight className="size-3.5" aria-hidden />
              العقارات
            </Link>
            {property.status === 'PENDING_REVIEW' ? (
              <Link
                href={routes.properties.pending}
                className="text-xs text-amber-700 hover:underline"
              >
                طابور المراجعة
              </Link>
            ) : null}
          </div>

          <h1 className="text-xl font-bold text-ink-950 sm:text-2xl">{title}</h1>

          <div className="flex flex-wrap items-center gap-2">
            <PropertyStatusBadge status={property.status} />
            {property.referenceNumber ? (
              <span
                className="rounded-md bg-surface-50 px-2 py-0.5 text-xs font-medium text-ink-700"
                dir="ltr"
              >
                {property.referenceNumber}
              </span>
            ) : null}
            {property.propertyType ? (
              <span className="text-xs text-ink-600">
                {formatTypeLabel(property.propertyType)}
              </span>
            ) : null}
            {property.transactionType ? (
              <>
                <span className="text-ink-300" aria-hidden>
                  ·
                </span>
                <span className="text-xs text-ink-600">
                  {formatTypeLabel(property.transactionType)}
                </span>
              </>
            ) : null}
          </div>

          <p className="text-xs text-ink-500">
            أُنشئ {formatDate(property.createdAt)}
            <span className="mx-1.5 text-ink-300" aria-hidden>
              ·
            </span>
            حُدّث {formatDate(property.updatedAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {editAllowed ? (
            <Link href={editHref}>
              <Button type="button" variant="primary" size="small">
                تعديل
              </Button>
            </Link>
          ) : null}
          <PropertyActionMenu
            propertyId={property.id}
            status={property.status}
            permissions={permissions}
            showView={false}
            editHref={editHref}
          />
        </div>
      </div>
    </header>
  );
}
