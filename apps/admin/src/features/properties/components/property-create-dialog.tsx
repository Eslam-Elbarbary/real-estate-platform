'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import type { PropertyFormCatalogs } from '../types';
import { PropertyForm } from './property-form';

interface PropertyCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogs: PropertyFormCatalogs;
  permissions: string[];
  onSuccess: (created: { id: string; status: string; title: string }) => void;
}

const FORM_ID = 'property-create-form';

export function PropertyCreateDialog({
  open,
  onOpenChange,
  catalogs,
  permissions,
  onSuccess,
}: PropertyCreateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canCreate = hasPermission(permissions, 'properties.create');

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    if (loading) {
      return;
    }
    onOpenChange(nextOpen);
  }

  function handleSuccess(created: { id: string; status: string; title: string }) {
    onOpenChange(false);
    onSuccess(created);
  }

  const dialogTree = (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="إضافة عقار"
      description="أنشئ إعلان عقار جديد كمسودة."
      className="w-[min(100%-2rem,42rem)]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleOpenChange(false);
            }}
          >
            إلغاء
          </Button>
          {canCreate ? (
            <Button
              type="submit"
              form={FORM_ID}
              variant="primary"
              size="small"
              disabled={loading}
            >
              {loading ? 'جاري الإنشاء…' : 'إنشاء العقار'}
            </Button>
          ) : null}
        </>
      }
    >
      {open ? (
        <PropertyForm
          mode="create"
          catalogs={catalogs}
          permissions={permissions}
          formId={FORM_ID}
          disabled={loading}
          onLoadingChange={setLoading}
          onSuccess={(created) => {
            if (created) {
              handleSuccess(created);
            }
          }}
        />
      ) : null}
    </Dialog>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(dialogTree, document.body);
}
