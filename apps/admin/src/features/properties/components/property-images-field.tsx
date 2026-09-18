'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Star,
  Trash2,
} from 'lucide-react';
import { MediaPicker } from '@/components/media-picker';
import type { MediaAsset } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { formatMediaFileName } from '@/features/media/format';
import { cn } from '@/lib/utils/cn';

interface PropertyImagesFieldProps {
  value: MediaAsset[];
  primaryId: string | null;
  onChange: (assets: MediaAsset[]) => void;
  onPrimaryChange: (id: string) => void;
  permissions: string[];
  disabled?: boolean;
  error?: string;
  title?: string;
}

/** Create-only media picker. Edit flow uses PropertyMediaManager. */
export function PropertyImagesField({
  value,
  primaryId,
  onChange,
  onPrimaryChange,
  permissions,
  disabled = false,
  error,
  title = 'الوسائط',
}: PropertyImagesFieldProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const hasSelection = value.length > 0;

  function moveAsset(assetId: string, direction: -1 | 1) {
    const index = value.findIndex((asset) => asset.id === assetId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= value.length) {
      return;
    }

    const next = [...value];
    const current = next[index];
    const other = next[target];
    if (!current || !other) {
      return;
    }
    next[index] = other;
    next[target] = current;
    onChange(next);
  }

  function confirmDelete() {
    if (!deleteId) {
      return;
    }

    const next = value.filter((asset) => asset.id !== deleteId);
    onChange(next);
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-xs text-ink-500">
          اختر صور العقار من مكتبة الوسائط. رتّب الصور وحدد صورة رئيسية واحدة قبل النشر.
        </p>
      </div>

      <MediaPicker
        value={value}
        onChange={onChange}
        multiple
        maxItems={20}
        folder="properties"
        disabled={disabled}
        permissions={permissions}
      />

      {!hasSelection ? (
        <EmptyState
          title="لا توجد صور بعد"
          description="أرفق صورة واحدة على الأقل قبل النشر. يمكنك الحفظ كمسودة بدون صور."
          icon={<ImageIcon className="size-5" aria-hidden />}
          className="py-8"
        />
      ) : (
        <ul className="space-y-2">
          {value.map((asset, index) => {
            const isPrimary = primaryId === asset.id;
            return (
              <li
                key={asset.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-white p-2',
                  isPrimary ? 'border-accent-400' : 'border-border',
                )}
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={formatMediaFileName(asset.fileName)}
                    className="size-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {formatMediaFileName(asset.fileName)}
                    </p>
                    {isPrimary ? (
                      <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-800">
                        رئيسية
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-ink-400" dir="ltr">
                    #{index + 1}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={disabled || index === 0}
                    onClick={() => moveAsset(asset.id, -1)}
                    aria-label="تحريك لأعلى"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={disabled || index === value.length - 1}
                    onClick={() => moveAsset(asset.id, 1)}
                    aria-label="تحريك لأسفل"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={disabled || isPrimary}
                    onClick={() => onPrimaryChange(asset.id)}
                    aria-label="تعيين كرئيسية"
                  >
                    <Star
                      className={cn(
                        'size-3.5',
                        isPrimary && 'fill-accent-500 text-accent-500',
                      )}
                    />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={disabled}
                    onClick={() => setDeleteId(asset.id)}
                    aria-label="حذف الصورة"
                  >
                    <Trash2 className="size-3.5 text-danger-600" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {error ? <span className="text-xs text-danger-600">{error}</span> : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
        title="حذف الصورة؟"
        description="سيتم إزالة الصورة من قائمة الإرفاق. يمكنك إعادة اختيارها لاحقاً من المكتبة."
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
