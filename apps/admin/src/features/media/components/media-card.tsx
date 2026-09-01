'use client';

import Image from 'next/image';
import { Eye, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  formatMediaDate,
  formatMediaFileName,
  formatMediaFolder,
  formatMediaSize,
} from '../format';
import type { MediaAsset } from '../types';

interface MediaCardProps {
  asset: MediaAsset;
  canDelete: boolean;
  onPreview: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
}

export function MediaCard({
  asset,
  canDelete,
  onPreview,
  onDelete,
}: MediaCardProps) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-border bg-white shadow-sm',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <button
        type="button"
        className="relative block aspect-square w-full overflow-hidden bg-surface-100"
        onClick={() => onPreview(asset)}
        aria-label={`معاينة ${formatMediaFileName(asset.fileName)}`}
      >
        <Image
          src={asset.url}
          alt={formatMediaFileName(asset.fileName)}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-brand-600/0 transition-colors group-hover:bg-brand-600/10" />
      </button>

      <div className="space-y-3 p-3.5">
        <div className="space-y-2">
          <p className="truncate text-sm font-semibold text-ink-900">
            {formatMediaFileName(asset.fileName)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{formatMediaFolder(asset.folder)}</Badge>
            <span className="text-xs text-ink-500">{formatMediaSize(asset.size)}</span>
          </div>
          <p className="text-xs text-ink-500">{formatMediaDate(asset.createdAt)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="small"
            className="flex-1 gap-1.5"
            onClick={() => onPreview(asset)}
          >
            <Eye className="size-3.5" aria-hidden />
            معاينة
          </Button>
          {canDelete ? (
            <Button
              type="button"
              variant="danger"
              size="small"
              className="gap-1.5"
              onClick={() => onDelete(asset)}
              aria-label={`حذف ${formatMediaFileName(asset.fileName)}`}
            >
              <Trash2 className="size-3.5" aria-hidden />
              حذف
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
