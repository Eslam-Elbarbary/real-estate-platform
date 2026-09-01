'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { CompoundForm } from './compound-form';

interface CompoundCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: UserRole[];
  onSuccess: () => void;
}

const FORM_ID = 'compound-create-form';

export function CompoundCreateDialog({
  open,
  onOpenChange,
  roles,
  onSuccess,
}: CompoundCreateDialogProps) {
  const [loading, setLoading] = useState(false);
  const canCreate = hasPermission(roles, 'compounds.create');

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
      title="إضافة مشروع"
      description="أدخل بيانات المشروع الجديد."
      className="w-[min(100%-2rem,42rem)]"
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
              {loading ? 'جاري الإضافة…' : 'إضافة مشروع'}
            </Button>
          ) : null}
        </>
      }
    >
      {open ? (
        <CompoundForm
          mode="create"
          roles={roles}
          formId={FORM_ID}
          disabled={loading}
          onLoadingChange={setLoading}
          onSuccess={handleSuccess}
        />
      ) : null}
    </Dialog>
  );
}
