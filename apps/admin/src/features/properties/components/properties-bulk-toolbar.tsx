'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog } from '@/components/ui/dialog';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import {
  approvePropertyAction,
  archivePropertyAction,
  deleteDraftPropertyAction,
  publishPropertyAction,
  rejectPropertyAction,
  restorePropertyAction,
  unpublishPropertyAction,
} from '../actions';
import {
  isEligibleForAction,
  type PropertyLifecycleAction,
} from '../lifecycle';
import type { Property } from '../types';

interface PropertiesBulkToolbarProps {
  items: Property[];
  selectedIds: Set<string>;
  permissions: string[];
  onClearSelection: () => void;
}

type BulkConfirmKind = Exclude<PropertyLifecycleAction, 'reject'> | null;

const ACTION_META: Record<
  PropertyLifecycleAction,
  { label: string; success: string; variant?: 'primary' | 'danger' | 'outline' }
> = {
  approve: {
    label: 'قبول ونشر',
    success: 'تم قبول ونشر العقارات المحددة',
    variant: 'primary',
  },
  reject: {
    label: 'رفض',
    success: 'تم رفض العقارات المحددة',
    variant: 'danger',
  },
  publish: {
    label: 'نشر',
    success: 'تم نشر العقارات المحددة',
    variant: 'primary',
  },
  unpublish: {
    label: 'إلغاء النشر',
    success: 'تم إلغاء نشر العقارات المحددة',
    variant: 'outline',
  },
  archive: {
    label: 'أرشفة',
    success: 'تم أرشفة العقارات المحددة',
    variant: 'danger',
  },
  restore: {
    label: 'استعادة',
    success: 'تم استعادة العقارات المحددة',
    variant: 'primary',
  },
  delete: {
    label: 'حذف المسودات',
    success: 'تم حذف المسودات المحددة',
    variant: 'danger',
  },
};

export function PropertiesBulkToolbar({
  items,
  selectedIds,
  permissions,
  onClearSelection,
}: PropertiesBulkToolbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmKind, setConfirmKind] = useState<BulkConfirmKind>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds],
  );

  const availableActions = useMemo(() => {
    const actions: PropertyLifecycleAction[] = [
      'approve',
      'reject',
      'publish',
      'unpublish',
      'archive',
      'restore',
      'delete',
    ];

    return actions.filter((action) =>
      selectedItems.some((item) =>
        isEligibleForAction(action, item.status, permissions),
      ),
    );
  }, [selectedItems, permissions]);

  if (selectedIds.size === 0) {
    return null;
  }

  async function runBulk(
    action: PropertyLifecycleAction,
    rejectReason?: string,
  ) {
    const targets = selectedItems.filter((item) =>
      isEligibleForAction(action, item.status, permissions),
    );

    if (targets.length === 0) {
      toast.error('لا توجد عقارات مؤهلة لهذا الإجراء ضمن التحديد.');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of targets) {
      let result: { ok: boolean; error?: string };

      switch (action) {
        case 'approve':
          result = await approvePropertyAction(item.id);
          break;
        case 'reject':
          result = await rejectPropertyAction(item.id, rejectReason ?? '');
          break;
        case 'publish':
          result = await publishPropertyAction(item.id);
          break;
        case 'unpublish':
          result = await unpublishPropertyAction(item.id);
          break;
        case 'archive':
          result = await archivePropertyAction(item.id);
          break;
        case 'restore':
          result = await restorePropertyAction(item.id);
          break;
        case 'delete':
          result = await deleteDraftPropertyAction(item.id);
          break;
        default:
          result = { ok: false, error: 'إجراء غير معروف' };
      }

      if (result.ok) {
        successCount += 1;
      } else {
        failCount += 1;
        toast.error(getAdminErrorMessage(result.error));
      }
    }

    setLoading(false);
    setConfirmKind(null);
    setRejectOpen(false);
    setReason('');
    setReasonError(null);

    if (successCount > 0) {
      toast.success(
        `${ACTION_META[action].success} (${successCount.toLocaleString('ar-EG')})`,
      );
      onClearSelection();
      router.refresh();
    }

    if (failCount > 0 && successCount === 0) {
      toast.error('تعذّر تنفيذ الإجراء على العناصر المحددة.');
    }
  }

  const confirmCopy: Record<
    Exclude<BulkConfirmKind, null>,
    { title: string; description: string; label: string; variant: 'primary' | 'danger' }
  > = {
    approve: {
      title: 'قبول ونشر المحدد',
      description: 'سيتم اعتماد ونشر جميع العقارات المؤهلة ضمن التحديد.',
      label: 'قبول ونشر',
      variant: 'primary',
    },
    publish: {
      title: 'نشر المحدد',
      description: 'هل تريد نشر العقارات المؤهلة المحددة؟',
      label: 'نشر',
      variant: 'primary',
    },
    unpublish: {
      title: 'إلغاء نشر المحدد',
      description: 'سيتم إلغاء نشر العقارات المنشورة ضمن التحديد.',
      label: 'إلغاء النشر',
      variant: 'danger',
    },
    archive: {
      title: 'أرشفة المحدد',
      description: 'هل أنت متأكد من أرشفة العقارات المؤهلة المحددة؟',
      label: 'أرشفة',
      variant: 'danger',
    },
    restore: {
      title: 'استعادة المحدد',
      description: 'سيتم استعادة العقارات المؤرشفة ضمن التحديد.',
      label: 'استعادة',
      variant: 'primary',
    },
    delete: {
      title: 'حذف المسودات المحددة',
      description: 'هل أنت متأكد من حذف المسودات؟ لا يمكن التراجع',
      label: 'حذف',
      variant: 'danger',
    },
  };

  return (
    <>
      <div className="sticky top-topbar z-10 flex flex-wrap items-center justify-between gap-3 border-b border-brand-200 bg-brand-50 px-4 py-3">
        <p className="text-sm font-medium text-ink-900">
          تم تحديد{' '}
          <span className="tabular-nums">
            {selectedIds.size.toLocaleString('ar-EG')}
          </span>{' '}
          عقار
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {availableActions.map((action) => (
            <Button
              key={action}
              type="button"
              size="small"
              variant={ACTION_META[action].variant ?? 'outline'}
              disabled={loading}
              onClick={() => {
                if (action === 'reject') {
                  setRejectOpen(true);
                  return;
                }
                setConfirmKind(action);
              }}
            >
              {ACTION_META[action].label}
            </Button>
          ))}
          <Button
            type="button"
            size="small"
            variant="ghost"
            disabled={loading}
            onClick={onClearSelection}
          >
            إلغاء التحديد
          </Button>
        </div>
      </div>

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
            void runBulk(confirmKind);
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
        title="رفض العقارات المحددة"
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
                const trimmed = reason.trim();
                if (!trimmed) {
                  setReasonError('سبب الرفض مطلوب.');
                  return;
                }
                setReasonError(null);
                void runBulk('reject', trimmed);
              }}
            >
              {loading ? 'جاري التنفيذ…' : 'تأكيد الرفض'}
            </Button>
          </>
        }
      >
        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="bulk-reject-reason">
          <span className="font-medium text-ink-800">سبب الرفض</span>
          <textarea
            id="bulk-reject-reason"
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
            placeholder="اكتب سبب الرفض الذي سيُطبَّق على جميع العناصر المؤهلة..."
          />
          {reasonError ? (
            <span className="text-xs text-danger-600">{reasonError}</span>
          ) : null}
        </label>
      </Dialog>
    </>
  );
}
