'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { getMediaImageUrl } from '@/features/media/normalize';
import { formatMediaFileName } from '@/features/media/format';
import { cn } from '@/lib/utils/cn';
import type { MediaPickerCardProps } from './types';

export function MediaPickerCard({ asset, selected, onToggle }: MediaPickerCardProps) {
  const imageUrl = getMediaImageUrl(asset);

  return (
    <button
      type="button"
      className={cn(
        'group w-full overflow-hidden rounded-xl border bg-white text-start shadow-sm transition-all',
        'hover:-translate-y-0.5 hover:shadow-md',
        selected
          ? 'border-accent-500 ring-2 ring-accent-500/30'
          : 'border-border hover:border-accent-500/40',
      )}
      onClick={() => onToggle(asset)}
      aria-pressed={selected}
      aria-label={formatMediaFileName(asset.fileName)}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={formatMediaFileName(asset.fileName)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-ink-400">
            لا توجد معاينة
          </div>
        )}
        {selected ? (
          <span className="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-accent-500 text-white shadow-sm">
            <Check className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>
      <div className="border-t border-border px-3 py-2.5">
        <p className="truncate text-sm font-medium text-ink-900">
          {formatMediaFileName(asset.fileName)}
        </p>
      </div>
    </button>
  );
}
