'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { UserRole } from '@/types';
import { updateUserStatusAction } from '../actions';

interface UserActionsProps {
  userId: string;
  isActive: boolean;
  userName: string;
  roles: UserRole[];
}

export function UserActions({ userId, isActive, userName, roles }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const nextIsActive = !isActive;

  if (!hasPermission(roles, 'users.update_status')) {
    return null;
  }

  async function handleConfirm() {
    setLoading(true);

    const result = await updateUserStatusAction(userId, nextIsActive);

    if (result.ok) {
      toast.success(nextIsActive ? 'تم تفعيل الحساب بنجاح.' : 'تم تعطيل الحساب بنجاح.');
      setConfirmOpen(false);
      await router.refresh();
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }

  return (
    <>
      <Button
        type="button"
        variant={isActive ? 'danger' : 'primary'}
        size="small"
        disabled={loading}
        onClick={() => setConfirmOpen(true)}
      >
        {isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setConfirmOpen(open);
          }
        }}
        title={isActive ? 'تعطيل المستخدم' : 'تفعيل المستخدم'}
        description={
          isActive
            ? `هل تريد تعطيل حساب "${userName}"؟`
            : `هل تريد تفعيل حساب "${userName}"؟`
        }
        confirmLabel={isActive ? 'تعطيل' : 'تفعيل'}
        variant={isActive ? 'danger' : 'primary'}
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
}
