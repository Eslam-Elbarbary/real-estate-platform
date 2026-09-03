'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { DeveloperForm } from './developer-form';

interface DeveloperCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: string[];
  onSuccess: () => void;
}

const FORM_ID = 'developer-create-form';

export function DeveloperCreateDialog({
  open,
  onOpenChange,
  permissions,
  onSuccess,
}: DeveloperCreateDialogProps) {
  const [loading, setLoading] = useState(false);
  const canCreate = hasPermission(permissions, 'developers.create');

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
      title="إضافة مطور"
      description="أدخل بيانات المطور الجديد."
      className="w-[min(100%-2rem,36rem)]"
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
          {canCreate ? (
            <Button
              type="submit"
              form={FORM_ID}
              variant="primary"
              size="small"
              disabled={loading}
            >
              {loading ? 'جاري الإضافة…' : 'إضافة مطور'}
            </Button>
          ) : null}
        </>
      }
    >
      {open ? (
        <DeveloperForm
          mode="create"
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
