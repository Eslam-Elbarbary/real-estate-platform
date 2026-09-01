'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';
import { hasPermission } from '@/features/auth/permissions';
import { formatMediaFileName } from '@/features/media/format';
import type { MediaAsset } from '@/features/media/types';
import { cn } from '@/lib/utils/cn';
import { MediaPickerDialog } from './media-picker-dialog';
import type { MediaPickerProps } from './types';

export function MediaPicker({
  value,
  onChange,
  multiple = false,
  maxItems,
  folder,
  disabled = false,
  roles,
}: MediaPickerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const canView = hasPermission(roles, 'media.view');

  const atMaxItems =
    maxItems !== undefined && value.length >= maxItems && multiple;

  function removeImage(id: string) {
    onChange(value.filter((asset) => asset.id !== id));
  }

  function handleConfirm(images: MediaAsset[]) {
    if (!multiple) {
      onChange(images.slice(0, 1));
      return;
    }

    const merged = images.reduce<MediaAsset[]>((acc, asset) => {
      if (acc.some((item) => item.id === asset.id)) {
        return acc;
      }
      return [...acc, asset];
    }, []);

    onChange(maxItems !== undefined ? merged.slice(0, maxItems) : merged);
  }

  if (!canView) {
    return (
      <p className="text-sm text-ink-500">ليس لديك صلاحية لاختيار الوسائط.</p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((asset) => (
          <div
            key={asset.id}
            className="relative size-24 overflow-hidden rounded-xl border border-border bg-white shadow-sm"
          >
            <Image
              src={asset.url}
              alt={formatMediaFileName(asset.fileName)}
              fill
              sizes="96px"
              className="object-cover"
            />
            {!disabled ? (
              <button
                type="button"
                className="absolute end-1 top-1 rounded-full bg-white/95 p-1 text-ink-700 shadow-sm transition-colors hover:bg-danger-50 hover:text-danger-600"
                aria-label={`إزالة ${formatMediaFileName(asset.fileName)}`}
                onClick={() => removeImage(asset.id)}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            ) : null}
          </div>
        ))}

        {!disabled && !atMaxItems ? (
          <button
            type="button"
            className={cn(
              'flex size-24 flex-col items-center justify-center gap-1.5 rounded-xl',
              'border border-dashed border-border bg-surface-50 text-ink-600',
              'transition-colors hover:border-accent-500/40 hover:bg-accent-50/40 hover:text-accent-700',
            )}
            onClick={() => setDialogOpen(true)}
          >
            <ImagePlus className="size-5" aria-hidden />
            <span className="text-xs font-medium">إضافة صورة</span>
          </button>
        ) : null}
      </div>

      {maxItems !== undefined && multiple ? (
        <p className="text-xs text-ink-500">
          {value.length.toLocaleString('ar-EG')} / {maxItems.toLocaleString('ar-EG')} صورة
        </p>
      ) : null}

      <MediaPickerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        value={value}
        onConfirm={handleConfirm}
        multiple={multiple}
        maxItems={maxItems}
        folder={folder}
        roles={roles}
      />
    </div>
  );
}
