'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { UserRole } from '@/types';
import { updateLeadStatusAction } from '../actions';
import type { LeadStatus } from '../types';

interface LeadActionsProps {
  leadId: string;
  status: LeadStatus;
  roles: UserRole[];
}

interface StatusAction {
  nextStatus: LeadStatus;
  label: string;
  title: string;
  description: string;
  variant?: 'primary' | 'danger';
}

const FORWARD_ACTIONS: Partial<Record<LeadStatus, StatusAction>> = {
  NEW: {
    nextStatus: 'CONTACTED',
    label: 'تم التواصل',
    title: 'تحديث الحالة إلى تم التواصل',
    description: 'هل تريد تحديث حالة الطلب إلى «تم التواصل»؟',
  },
  CONTACTED: {
    nextStatus: 'FOLLOW_UP',
    label: 'متابعة',
    title: 'تحديث الحالة إلى متابعة',
    description: 'هل تريد تحديث حالة الطلب إلى «متابعة»؟',
  },
  FOLLOW_UP: {
    nextStatus: 'INTERESTED',
    label: 'مهتم',
    title: 'تحديث الحالة إلى مهتم',
    description: 'هل تريد تحديث حالة الطلب إلى «مهتم»؟',
  },
  INTERESTED: {
    nextStatus: 'CLOSED',
    label: 'مغلق',
    title: 'تحديث الحالة إلى مغلق',
    description: 'هل تريد إغلاق هذا الطلب؟',
  },
};

const REJECT_ACTION: StatusAction = {
  nextStatus: 'REJECTED',
  label: 'رفض',
  title: 'رفض الطلب',
  description: 'هل تريد رفض هذا الطلب؟',
  variant: 'danger',
};

export function LeadActions({ leadId, status, roles }: LeadActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<StatusAction | null>(null);

  if (!hasPermission(roles, 'leads.update_status')) {
    return null;
  }

  const forwardAction = FORWARD_ACTIONS[status];
  const canReject = status !== 'REJECTED';

  if (!forwardAction && !canReject) {
    return null;
  }

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setLoading(true);

    const result = await updateLeadStatusAction(leadId, pendingAction.nextStatus);

    if (result.ok) {
      toast.success('تم تحديث حالة الطلب بنجاح.');
      setPendingAction(null);
      await router.refresh();
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {forwardAction ? (
          <Button
            type="button"
            variant="primary"
            size="small"
            disabled={loading}
            onClick={() => setPendingAction(forwardAction)}
          >
            {forwardAction.label}
          </Button>
        ) : null}

        {canReject ? (
          <Button
            type="button"
            variant="danger"
            size="small"
            disabled={loading}
            onClick={() => setPendingAction(REJECT_ACTION)}
          >
            {REJECT_ACTION.label}
          </Button>
        ) : null}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!loading && !open) {
            setPendingAction(null);
          }
        }}
        title={pendingAction?.title ?? ''}
        description={pendingAction?.description}
        confirmLabel="تأكيد"
        variant={pendingAction?.variant ?? 'primary'}
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
}
