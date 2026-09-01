'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import type { Developer } from '@/features/developers/types';
import type { UserRole } from '@/types';
import type { Compound } from '../types';
import { CompoundForm } from './compound-form';

interface CompoundEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compound: Compound;
  initialDeveloper?: Developer | null;
  roles: UserRole[];
  onSuccess: () => void;
}

const FORM_ID = 'compound-edit-form';

export function CompoundEditDialog({
  open,
  onOpenChange,
  compound,
  initialDeveloper,
  roles,
  onSuccess,
}: CompoundEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const canUpdate = hasPermission(roles, 'compounds.update');

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
      title="تعديل مشروع"
      description={compound.nameAr ?? compound.nameEn}
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
        <CompoundForm
          mode="edit"
          initialData={compound}
          initialDeveloper={initialDeveloper}
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
