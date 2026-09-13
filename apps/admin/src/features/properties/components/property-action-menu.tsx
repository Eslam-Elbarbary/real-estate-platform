'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog } from '@/components/ui/dialog';
import { routes } from '@/config/routes';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import type { PropertyStatus } from '@/types';
import {
  approvePropertyAction,
  archivePropertyAction,
  publishPropertyAction,
  rejectPropertyAction,
  restorePropertyAction,
  unpublishPropertyAction,
} from '../actions';

interface PropertyActionMenuProps {
  propertyId: string;
  status: PropertyStatus;
  permissions: string[];
  /** Open edit dialog when provided (details page). Otherwise links to details. */
  onEdit?: () => void;
  showView?: boolean;
  compact?: boolean;
}

type ConfirmKind = 'unpublish' | 'archive' | 'approve' | 'publish' | 'restore' | null;

export function PropertyActionMenu({
  propertyId,
  status,
  permissions,
  onEdit,
  showView = true,
  compact = false,
}: PropertyActionMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const canUpdate = hasPermission(permissions, 'properties.update');
  const canApprove =
    status === 'PENDING_REVIEW' && hasPermission(permissions, 'properties.approve');
  const canReject =
    status === 'PENDING_REVIEW' && hasPermission(permissions, 'properties.reject');
  const canPublish =
    (status === 'DRAFT' || status === 'REJECTED' || status === 'EXPIRED') &&
    hasPermission(permissions, 'properties.publish');
  const canUnpublish =
    status === 'PUBLISHED' && hasPermission(permissions, 'properties.publish');
  const canArchive =
    (status === 'PUBLISHED' ||
      status === 'DRAFT' ||
      status === 'REJECTED' ||
      status === 'EXPIRED' ||
      status === 'PENDING_REVIEW') &&
    hasPermission(permissions, 'properties.archive');
  const canRestore =
    status === 'ARCHIVED' && hasPermission(permissions, 'properties.archive');

  const editAllowed =
    canUpdate &&
    (status === 'PUBLISHED' ||
      status === 'DRAFT' ||
      status === 'REJECTED' ||
      status === 'EXPIRED' ||
      status === 'PENDING_PAYMENT');

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  async function runAction(
    action: () => Promise<{ ok: boolean; error?: string }>,
    successMessage: string,
  ) {
    setLoading(true);
    const result = await action();

    if (result.ok) {
      toast.success(successMessage);
      setConfirmKind(null);
      setRejectOpen(false);
      setReason('');
      setReasonError(null);
      setOpen(false);
      await router.refresh();
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }

  async function handleConfirm() {
    if (confirmKind === 'unpublish') {
      await runAction(
        () => unpublishPropertyAction(propertyId),
        'تم إلغاء نشر العقار بنجاح',
      );
      return;
    }
    if (confirmKind === 'archive') {
      await runAction(
        () => archivePropertyAction(propertyId),
        'تم أرشفة العقار بنجاح',
      );
      return;
    }
    if (confirmKind === 'approve') {
      await runAction(
        () => approvePropertyAction(propertyId),
        'تم قبول ونشر العقار بنجاح',
      );
      return;
    }
    if (confirmKind === 'publish') {
      await runAction(
        () => publishPropertyAction(propertyId),
        'تم نشر العقار بنجاح',
      );
      return;
    }
    if (confirmKind === 'restore') {
      await runAction(
        () => restorePropertyAction(propertyId),
        'تم استعادة العقار بنجاح',
      );
    }
  }

  async function handleRejectConfirm() {
    const trimmed = reason.trim();
    if (!trimmed) {
      setReasonError('سبب الرفض مطلوب.');
      return;
    }
    setReasonError(null);
    await runAction(
      () => rejectPropertyAction(propertyId, trimmed),
      'تم رفض العقار بنجاح',
    );
  }

  const confirmCopy: Record<
    Exclude<ConfirmKind, null>,
    { title: string; description: string; label: string; variant: 'primary' | 'danger' }
  > = {
    unpublish: {
      title: 'إلغاء النشر',
      description: 'هل أنت متأكد من إلغاء نشر هذا العقار؟ سيعود إلى حالة المسودة.',
      label: 'إلغاء النشر',
      variant: 'danger',
    },
    archive: {
      title: 'أرشفة العقار',
      description: 'هل أنت متأكد من أرشفة هذا العقار؟',
      label: 'أرشفة',
      variant: 'danger',
    },
    approve: {
      title: 'قبول ونشر',
      description: 'سيتم اعتماد العقار ونشره للعامة.',
      label: 'قبول ونشر',
      variant: 'primary',
    },
    publish: {
      title: 'نشر العقار',
      description: 'هل تريد نشر هذا العقار الآن؟',
      label: 'نشر',
      variant: 'primary',
    },
    restore: {
      title: 'استعادة العقار',
      description: 'سيتم استعادة العقار من الأرشيف.',
      label: 'استعادة',
      variant: 'primary',
    },
  };

  const hasMenuItems =
    showView ||
    editAllowed ||
    canApprove ||
    canReject ||
    canPublish ||
    canUnpublish ||
    canArchive ||
    canRestore;

  if (!hasMenuItems) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        type="button"
        variant="outline"
        size="small"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {compact ? <MoreHorizontal className="size-4" aria-hidden /> : 'إجراءات'}
        <span className="sr-only">فتح قائمة الإجراءات</span>
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 z-30 mt-1 min-w-44 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg"
        >
          {showView ? (
            <Link
              href={routes.properties.details(propertyId)}
              role="menuitem"
              className="block px-3 py-2 text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => setOpen(false)}
            >
              عرض
            </Link>
          ) : null}

          {editAllowed && onEdit ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            >
              تعديل
            </button>
          ) : null}

          {editAllowed && !onEdit ? (
            <Link
              href={routes.properties.details(propertyId)}
              role="menuitem"
              className="block px-3 py-2 text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => setOpen(false)}
            >
              تعديل
            </Link>
          ) : null}

          {canApprove ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => {
                setOpen(false);
                setConfirmKind('approve');
              }}
            >
              قبول ونشر
            </button>
          ) : null}

          {canReject ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-danger-700 hover:bg-danger-50"
              onClick={() => {
                setOpen(false);
                setRejectOpen(true);
              }}
            >
              رفض
            </button>
          ) : null}

          {canPublish ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => {
                setOpen(false);
                setConfirmKind('publish');
              }}
            >
              نشر
            </button>
          ) : null}

          {canUnpublish ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => {
                setOpen(false);
                setConfirmKind('unpublish');
              }}
            >
              إلغاء النشر
            </button>
          ) : null}

          {canArchive ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => {
                setOpen(false);
                setConfirmKind('archive');
              }}
            >
              أرشفة
            </button>
          ) : null}

          {canRestore ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-start text-sm text-ink-800 hover:bg-surface-50"
              onClick={() => {
                setOpen(false);
                setConfirmKind('restore');
              }}
            >
              استعادة
            </button>
          ) : null}
        </div>
      ) : null}

      {confirmKind ? (
        <ConfirmDialog
          open
          onOpenChange={(next) => {
            if (!loading && !next) {
              setConfirmKind(null);
            }
          }}
          title={confirmCopy[confirmKind].title}
          description={confirmCopy[confirmKind].description}
          confirmLabel={confirmCopy[confirmKind].label}
          variant={confirmCopy[confirmKind].variant}
          loading={loading}
          onConfirm={() => {
            void handleConfirm();
          }}
        />
      ) : null}

      <Dialog
        open={rejectOpen}
        onOpenChange={(next) => {
          if (loading) {
            return;
          }
          setRejectOpen(next);
          if (!next) {
            setReason('');
            setReasonError(null);
          }
        }}
        title="رفض العقار"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={loading}
              onClick={() => setRejectOpen(false)}
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
        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor={`reject-${propertyId}`}>
          <span className="font-medium text-ink-800">سبب الرفض</span>
          <textarea
            id={`reject-${propertyId}`}
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
              reasonError && 'border-danger-500 focus-visible:ring-danger-200',
            )}
            placeholder="اكتب سبب رفض العقار..."
          />
          {reasonError ? (
            <span className="text-xs text-danger-600">{reasonError}</span>
          ) : null}
        </label>
      </Dialog>
    </div>
  );
}
