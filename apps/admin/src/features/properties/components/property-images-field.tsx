'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { MediaPicker } from '@/components/media-picker';
import type { MediaAsset } from '@/components/media-picker';
import { formatMediaFileName } from '@/features/media/format';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';
import type { AdminPropertyImage } from '../types';

interface PropertyImagesFieldProps {
  value: MediaAsset[];
  primaryId: string | null;
  onChange: (assets: MediaAsset[]) => void;
  onPrimaryChange: (id: string) => void;
  existingImages?: AdminPropertyImage[];
  roles: UserRole[];
  disabled?: boolean;
  error?: string;
}

export function PropertyImagesField({
  value,
  primaryId,
  onChange,
  onPrimaryChange,
  existingImages = [],
  roles,
  disabled = false,
  error,
}: PropertyImagesFieldProps) {
  const hasExisting = existingImages.length > 0;
  const hasNewSelection = value.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">الصور</h3>
        <p className="mt-1 text-xs text-ink-500">
          {hasExisting
            ? 'الصور الحالية معروضة أدناه. عند اختيار صور جديدة سيتم استبدال جميع الصور الحالية.'
            : 'اختر صور العقار من مكتبة الوسائط. يجب تحديد صورة رئيسية واحدة.'}
        </p>
      </div>

      {hasExisting ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-ink-600">الصور الحالية</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((image) => (
              <div
                key={`${image.url}-${image.sortOrder}`}
                className="relative size-24 overflow-hidden rounded-xl border border-border bg-white shadow-sm"
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                {image.isPrimary ? (
                  <span className="absolute bottom-1 start-1 rounded-full bg-accent-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    رئيسية
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <MediaPicker
        value={value}
        onChange={onChange}
        multiple
        maxItems={20}
        folder="properties"
        disabled={disabled}
        roles={roles}
      />

      {hasNewSelection ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-ink-600">تحديد الصورة الرئيسية</p>
          <div className="flex flex-wrap gap-2">
            {value.map((asset) => {
              const isPrimary = primaryId === asset.id;
              return (
                <button
                  key={asset.id}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    isPrimary
                      ? 'border-accent-500 bg-accent-50 text-accent-800'
                      : 'border-border bg-white text-ink-700 hover:border-accent-300',
                    disabled && 'cursor-not-allowed opacity-60',
                  )}
                  onClick={() => onPrimaryChange(asset.id)}
                >
                  <Star
                    className={cn('size-3.5', isPrimary && 'fill-accent-500 text-accent-500')}
                    aria-hidden
                  />
                  {formatMediaFileName(asset.fileName)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {error ? <span className="text-xs text-danger-600">{error}</span> : null}
    </div>
  );
}
