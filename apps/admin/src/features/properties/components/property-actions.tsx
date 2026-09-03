'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import { cn } from '@/lib/utils/cn';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { PropertyStatus, UserRole } from '@/types';
import {
  approvePropertyAction,
  archivePropertyAction,
  rejectPropertyAction,
} from '../actions';

interface PropertyActionsProps {
  propertyId: string;
  status: PropertyStatus;
  permissions: string[];
}

export function PropertyActions({ propertyId, status, permissions }: PropertyActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);

  const showPendingActions = status === 'PENDING_REVIEW';
  const showArchiveAction = status === 'PUBLISHED';
  const canApprove =
    showPendingActions && hasPermission(permissions, 'properties.approve');
  const canReject =
    showPendingActions && hasPermission(permissions, 'properties.reject');
  const canArchive =
    showArchiveAction && hasPermission(permissions, 'properties.archive');

  if (!canApprove && !canReject && !canArchive) {
    return null;
  }

  async function runAction(
    action: () => Promise<{ ok: boolean; error?: string }>,
    successMessage: string,
  ) {
    setLoading(true);

    const result = await action();

    if (result.ok) {
      toast.success(successMessage);
      setRejectOpen(false);
      setReason('');
      setReasonError(null);
      await router.refresh();
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }

  async function handleApprove() {
    await runAction(
      () => approvePropertyAction(propertyId),
      'تم اعتماد العقار بنجاح.',
    );
  }

  async function handleArchive() {
    await runAction(
      () => archivePropertyAction(propertyId),
      'تم أرشفة العقار بنجاح.',
    );
  }

  async function handleRejectConfirm() {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setReasonError('سبب الرفض مطلوب.');
      return;
    }

    setReasonError(null);
    await runAction(
      () => rejectPropertyAction(propertyId, trimmedReason),
      'تم رفض العقار بنجاح.',
    );
  }

  function handleRejectOpenChange(open: boolean) {
    if (loading) {
      return;
    }

    setRejectOpen(open);
    if (!open) {
      setReason('');
      setReasonError(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {canApprove ? (
          <Button
            type="button"
            variant="primary"
            size="small"
            disabled={loading}
            onClick={() => {
              void handleApprove();
            }}
          >
            {loading ? 'جاري التنفيذ…' : 'اعتماد'}
          </Button>
        ) : null}

        {canReject ? (
          <Button
            type="button"
            variant="danger"
            size="small"
            disabled={loading}
            onClick={() => setRejectOpen(true)}
          >
            رفض
          </Button>
        ) : null}

        {canArchive ? (
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={loading}
            onClick={() => {
              void handleArchive();
            }}
          >
            {loading ? 'جاري التنفيذ…' : 'أرشفة'}
          </Button>
        ) : null}
      </div>

      <Dialog
        open={rejectOpen}
        onOpenChange={handleRejectOpenChange}
        title="رفض العقار"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={loading}
              onClick={() => handleRejectOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="danger"
              size="small"
              disabled={loading}
              onClick={() => {
                void handleRejectConfirm();
              }}
            >
              {loading ? 'جاري التنفيذ…' : 'تأكيد الرفض'}
            </Button>
          </>
        }
      >
        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="reject-reason">
          <span className="font-medium text-ink-800">سبب الرفض</span>
          <textarea
            id="reject-reason"
            name="reason"
            rows={4}
            value={reason}
            disabled={loading}
            onChange={(event) => {
              setReason(event.target.value);
              if (reasonError && event.target.value.trim()) {
                setReasonError(null);
              }
            }}
            className={cn(
              'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
              reasonError && 'border-danger-500 focus-visible:ring-danger-200',
            )}
            placeholder="اكتب سبب رفض العقار..."
            aria-invalid={Boolean(reasonError)}
          />
          {reasonError ? (
            <span className="text-xs text-danger-600">{reasonError}</span>
          ) : null}
        </label>
      </Dialog>
    </>
  );
}
