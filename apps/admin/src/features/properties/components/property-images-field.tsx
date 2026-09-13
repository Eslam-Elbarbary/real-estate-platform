'use client';

import { Star } from 'lucide-react';
import { MediaPicker } from '@/components/media-picker';
import type { MediaAsset } from '@/components/media-picker';
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
  const hasSelection = value.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-xs text-ink-500">
          اختر صور العقار من مكتبة الوسائط عند الإنشاء. يجب تحديد صورة رئيسية واحدة عند
          إضافة صور.
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

      {hasSelection ? (
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
