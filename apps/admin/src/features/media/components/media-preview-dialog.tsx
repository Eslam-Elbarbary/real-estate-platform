'use client';

import Image from 'next/image';
import { Dialog } from '@/components/ui/dialog';
import {
  formatMediaDate,
  formatMediaDimensions,
  formatMediaFileName,
  formatMediaFolder,
  formatMediaSize,
} from '../format';
import type { MediaAsset } from '../types';

interface MediaPreviewDialogProps {
  asset: MediaAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaPreviewDialog({
  asset,
  open,
  onOpenChange,
}: MediaPreviewDialogProps) {
  if (!asset) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={formatMediaFileName(asset.fileName)}
      description="معاينة تفاصيل الملف"
      className="w-[min(100%-2rem,42rem)]"
    >
      <div className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-50">
          <Image
            src={asset.url}
            alt={formatMediaFileName(asset.fileName)}
            fill
            sizes="(max-width: 768px) 100vw, 42rem"
            className="object-contain"
          />
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface-50 px-3 py-2.5">
            <dt className="text-xs text-ink-500">اسم الملف</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {formatMediaFileName(asset.fileName)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-surface-50 px-3 py-2.5">
            <dt className="text-xs text-ink-500">الأبعاد</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {formatMediaDimensions(asset.width, asset.height)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-surface-50 px-3 py-2.5">
            <dt className="text-xs text-ink-500">الحجم</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {formatMediaSize(asset.size)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-surface-50 px-3 py-2.5">
            <dt className="text-xs text-ink-500">المجلد</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {formatMediaFolder(asset.folder)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-surface-50 px-3 py-2.5 sm:col-span-2">
            <dt className="text-xs text-ink-500">تاريخ الرفع</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {formatMediaDate(asset.createdAt)}
            </dd>
          </div>
          {asset.uploadedBy ? (
            <div className="rounded-lg border border-border bg-surface-50 px-3 py-2.5 sm:col-span-2">
              <dt className="text-xs text-ink-500">رفع بواسطة</dt>
              <dd className="mt-1 text-sm font-medium text-ink-900">
                {asset.uploadedBy.name ?? asset.uploadedBy.id}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Dialog>
  );
}
