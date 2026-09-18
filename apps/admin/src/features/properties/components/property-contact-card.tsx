'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { hasPermission } from '@/features/auth/permissions';
import { canEditProperty } from '../lifecycle';
import { getPropertyContactAction } from '../actions';
import type { PropertyContactDto } from '../api-property-contact';
import type { AdminPropertyDetails } from '../types';
import {
  formatContactSourceLabel,
  formatContactTypeLabel,
} from './property-contact-step';

interface PropertyContactCardProps {
  property: AdminPropertyDetails;
  permissions: string[];
  initialContact?: PropertyContactDto | null;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/80 py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-ink-500">{label}</span>
      <span
        className="text-sm font-medium text-ink-900 sm:max-w-[70%] sm:text-end"
        dir={label === 'الاسم' || label === 'المصدر' || label === 'النوع' ? undefined : 'ltr'}
      >
        {value}
      </span>
    </div>
  );
}

export function PropertyContactCard({
  property,
  permissions,
  initialContact = null,
}: PropertyContactCardProps) {
  const [contact, setContact] = useState<PropertyContactDto | null>(
    initialContact,
  );
  const [loading, setLoading] = useState(!initialContact);
  const [error, setError] = useState<string | null>(null);

  const canEdit =
    canEditProperty(property.status, permissions) &&
    hasPermission(permissions, 'properties.update');

  useEffect(() => {
    if (initialContact) {
      setContact(initialContact);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void getPropertyContactAction(property.id).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
        setContact(null);
      } else {
        setError(null);
        setContact(result.data);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [property.id, initialContact]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <h2 className="text-base font-semibold text-ink-900">
            بيانات التواصل
          </h2>
          <p className="text-sm text-ink-500">
            تظهر لزوار صفحة العقار عند طلب التواصل.
          </p>
        </div>
        {canEdit ? (
          <Link href={routes.properties.edit(property.id)}>
            <Button type="button" variant="outline" size="small">
              تعديل التواصل
            </Button>
          </Link>
        ) : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-2 text-sm text-ink-500" role="status">
            جارٍ تحميل بيانات التواصل…
          </p>
        ) : error ? (
          <p className="py-2 text-sm text-danger-600">{error}</p>
        ) : !contact ? (
          <p className="py-2 text-sm text-ink-500">
            لا توجد بيانات تواصل محفوظة بعد.
          </p>
        ) : (
          <>
            <InfoRow
              label="المصدر"
              value={formatContactSourceLabel(contact.source)}
            />
            <InfoRow
              label="النوع"
              value={formatContactTypeLabel(contact.contactType)}
            />
            <InfoRow label="الاسم" value={contact.name?.trim() || '—'} />
            <InfoRow label="الهاتف" value={contact.phone?.trim() || '—'} />
            <InfoRow label="واتساب" value={contact.whatsapp?.trim() || '—'} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
