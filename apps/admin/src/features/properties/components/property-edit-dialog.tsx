'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import type { AdminPropertyDetails, PropertyFormCatalogs } from '../types';
import { PropertyForm } from './property-form';

interface PropertyEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: AdminPropertyDetails;
  catalogs: PropertyFormCatalogs;
  permissions: string[];
  onSuccess: () => void;
}

const FORM_ID = 'property-edit-form';

export function PropertyEditDialog({
  open,
  onOpenChange,
  property,
  catalogs,
  permissions,
  onSuccess,
}: PropertyEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const canUpdate = hasPermission(permissions, 'properties.update');

  function handleOpenChange(nextOpen: boolean) {
    if (loading) {
      return;
    }
    onOpenChange(nextOpen);
  }

  function handleSuccess() {
    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="تعديل العقار"
      description={property.title ?? property.slug}
      className="w-[min(100%-2rem,56rem)]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={loading}
            onClick={() => handleOpenChange(false)}
          >
            إلغاء
          </Button>
          {canUpdate ? (
            <Button
              type="submit"
              form={FORM_ID}
              variant="primary"
              size="small"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ…' : 'حفظ التعديلات'}
            </Button>
          ) : null}
        </>
      }
    >
      {open ? (
        <PropertyForm
          mode="edit"
          initialData={property}
          catalogs={catalogs}
          permissions={permissions}
          formId={FORM_ID}
          disabled={loading}
          onLoadingChange={setLoading}
          onSuccess={handleSuccess}
        />
      ) : null}
    </Dialog>
  );
}
