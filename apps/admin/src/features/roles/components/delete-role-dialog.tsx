'use client';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { deleteRoleAction } from '../actions';
import type { AdminRole } from '../types';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';

interface DeleteRoleDialogProps {
  open: boolean;
  role: AdminRole | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadingChange: (loading: boolean) => void;
  onSuccess: () => void;
}

export function DeleteRoleDialog({
  open,
  role,
  loading,
  onOpenChange,
  onLoadingChange,
  onSuccess,
}: DeleteRoleDialogProps) {
  async function handleConfirm() {
    if (!role) {
      return;
    }

    onLoadingChange(true);
    const result = await deleteRoleAction(role.id);

    if (result.ok) {
      toast.success('تم حذف الدور بنجاح.');
      onOpenChange(false);
      onSuccess();
      onLoadingChange(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    onLoadingChange(false);
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          onOpenChange(nextOpen);
        }
      }}
      title="حذف الدور"
      description={
        role
          ? `هل تريد حذف الدور "${role.name}" (${role.code})؟ لا يمكن التراجع عن هذا الإجراء.`
          : undefined
      }
      confirmLabel="حذف"
      variant="danger"
      loading={loading}
      onConfirm={handleConfirm}
    />
  );
}
