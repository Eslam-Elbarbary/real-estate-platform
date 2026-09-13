'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Film,
  ImageIcon,
  Star,
  Trash2,
} from 'lucide-react';
import { MediaPicker } from '@/components/media-picker';
import type { MediaAsset } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import {
  attachPropertyMediaAction,
  deletePropertyMediaAction,
  listPropertyMediaAction,
  reorderPropertyMediaAction,
  setPrimaryPropertyMediaAction,
} from '../actions';
import { formatMediaType } from '../format';
import type { AdminPropertyImage } from '../types';

interface PropertyMediaManagerProps {
  propertyId: string;
  initialImages: AdminPropertyImage[];
  permissions: string[];
  disabled?: boolean;
  title?: string;
  onChanged?: () => void;
}

export function PropertyMediaManager({
  propertyId,
  initialImages,
  permissions,
  disabled = false,
  title = '06 — الوسائط',
  onChanged,
}: PropertyMediaManagerProps) {
  const canUpdate = hasPermission(permissions, 'properties.update');
  const canViewMedia = hasPermission(permissions, 'media.view');
  const [images, setImages] = useState(initialImages);
  const [pendingAttach, setPendingAttach] = useState<MediaAsset[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [attaching, setAttaching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const sorted = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) {
          return a.isPrimary ? -1 : 1;
        }
        return a.sortOrder - b.sortOrder;
      }),
    [images],
  );

  async function refresh() {
    setRefreshing(true);
    const result = await listPropertyMediaAction(propertyId);
    setRefreshing(false);
    if (!result.ok) {
      toast.error(getAdminErrorMessage(result.error));
      return;
    }
    setImages(result.data);
    onChanged?.();
  }

  async function handleAttach() {
    if (!canUpdate || pendingAttach.length === 0) {
      return;
    }

    setAttaching(true);
    let failed = 0;

    for (const [index, asset] of pendingAttach.entries()) {
      const result = await attachPropertyMediaAction(propertyId, {
        mediaAssetId: asset.id,
        type: 'IMAGE',
        isPrimary: images.length === 0 && index === 0,
      });
      if (!result.ok) {
        failed += 1;
        toast.error(getAdminErrorMessage(result.error));
      }
    }

    setAttaching(false);
    setPendingAttach([]);

    if (failed === 0) {
      toast.success('تم إرفاق الوسائط بنجاح');
    }

    await refresh();
  }

  async function handleSetPrimary(imageId: string) {
    if (!canUpdate) {
      return;
    }
    setBusyId(imageId);
    const result = await setPrimaryPropertyMediaAction(propertyId, imageId);
    setBusyId(null);

    if (!result.ok) {
      toast.error(getAdminErrorMessage(result.error));
      return;
    }

    toast.success('تم تعيين الصورة الرئيسية');
    await refresh();
  }

  async function handleDelete() {
    if (!deleteId || !canUpdate) {
      return;
    }
    setBusyId(deleteId);
    const result = await deletePropertyMediaAction(propertyId, deleteId);
    setBusyId(null);
    setDeleteId(null);

    if (!result.ok) {
      toast.error(getAdminErrorMessage(result.error));
      return;
    }

    toast.success('تم حذف الوسائط بنجاح');
    await refresh();
  }

  async function moveImage(imageId: string, direction: -1 | 1) {
    if (!canUpdate) {
      return;
    }

    const ordered = [...sorted];
    const index = ordered.findIndex((image) => image.id === imageId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) {
      return;
    }

    const swapped = [...ordered];
    const current = swapped[index];
    const other = swapped[target];
    if (!current || !other) {
      return;
    }
    swapped[index] = other;
    swapped[target] = current;

    const payload = {
      images: swapped.map((image, sortOrder) => ({
        id: image.id,
        sortOrder,
      })),
    };

    setBusyId(imageId);
    const result = await reorderPropertyMediaAction(propertyId, payload);
    setBusyId(null);

    if (!result.ok) {
      toast.error(getAdminErrorMessage(result.error));
      return;
    }

    setImages(result.data);
    toast.success('تم تحديث ترتيب الوسائط');
    onChanged?.();
  }

  const locked = disabled || !canUpdate || attaching || refreshing || Boolean(busyId);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-xs text-ink-500">
          إدارة الوسائط بشكل تدريجي. لن يتم حذف الصور الحالية تلقائياً عند حفظ بيانات العقار.
        </p>
      </div>

      {refreshing && images.length === 0 ? (
        <LoadingState label="جاري تحميل الوسائط..." />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="لا توجد وسائط"
          description="أرفق صوراً أو فيديوهات من مكتبة الوسائط."
          className="py-8"
        />
      ) : (
        <ul className="space-y-2">
          {sorted.map((image, index) => {
            const isVideo = image.type === 'VIDEO';
            return (
              <li
                key={image.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-white p-2"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-ink-600">
                      {isVideo ? (
                        <Film className="size-3.5" aria-hidden />
                      ) : (
                        <ImageIcon className="size-3.5" aria-hidden />
                      )}
                      {formatMediaType(image.type)}
                    </span>
                    {image.isPrimary ? (
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
                    disabled={locked || index === 0}
                    onClick={() => {
                      void moveImage(image.id, -1);
                    }}
                    aria-label="تحريك لأعلى"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={locked || index === sorted.length - 1}
                    onClick={() => {
                      void moveImage(image.id, 1);
                    }}
                    aria-label="تحريك لأسفل"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={locked || image.isPrimary}
                    onClick={() => {
                      void handleSetPrimary(image.id);
                    }}
                    aria-label="تعيين كرئيسية"
                  >
                    <Star
                      className={cn(
                        'size-3.5',
                        image.isPrimary && 'fill-accent-500 text-accent-500',
                      )}
                    />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    disabled={locked}
                    onClick={() => setDeleteId(image.id)}
                    aria-label="حذف"
                  >
                    <Trash2 className="size-3.5 text-danger-600" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {canUpdate && canViewMedia ? (
        <div className="space-y-3 rounded-xl border border-dashed border-border p-3">
          <p className="text-xs font-medium text-ink-700">إضافة وسائط</p>
          <MediaPicker
            value={pendingAttach}
            onChange={setPendingAttach}
            multiple
            maxItems={20}
            folder="properties"
            disabled={locked}
            permissions={permissions}
          />
          <Button
            type="button"
            size="small"
            disabled={locked || pendingAttach.length === 0}
            onClick={() => {
              void handleAttach();
            }}
          >
            {attaching ? 'جاري الإرفاق…' : 'إرفاق المحدد'}
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(next) => {
          if (!next && !busyId) {
            setDeleteId(null);
          }
        }}
        title="حذف الوسائط"
        description="هل أنت متأكد من حذف هذا العنوان من معرض العقار؟"
        confirmLabel="حذف"
        variant="danger"
        loading={Boolean(busyId)}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
}
