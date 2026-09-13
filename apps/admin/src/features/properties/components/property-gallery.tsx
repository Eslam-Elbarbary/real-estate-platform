'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { AdminPropertyImage } from '../types';

interface PropertyGalleryProps {
  images: AdminPropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
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

  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex] ?? sorted[0];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-ink-900">المعرض</h2>
        <p className="text-sm text-ink-500">
          {sorted.length > 0
            ? `${sorted.length.toLocaleString('ar-EG')} عنصر`
            : 'لا توجد وسائط مرفوعة'}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.length === 0 || !active ? (
          <EmptyState
            title="لا توجد وسائط"
            description="لم يتم إرفاق صور أو فيديوهات لهذا العقار بعد."
            className="border-0 py-10 shadow-none"
          />
        ) : (
          <>
            <div className="relative overflow-hidden rounded-md border border-border bg-surface-50">
              {active.type === 'VIDEO' ? (
                <video
                  src={active.url}
                  controls
                  className="h-72 w-full bg-ink-900 object-contain"
                >
                  <track kind="captions" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.url}
                  alt={title}
                  className="h-72 w-full object-cover"
                />
              )}
              <div className="absolute start-3 top-3 flex flex-wrap gap-2">
                {active.isPrimary ? (
                  <Badge variant="brand">الصورة الرئيسية</Badge>
                ) : null}
                {active.type !== 'IMAGE' ? (
                  <Badge variant="default">
                    {active.type === 'VIDEO' ? 'فيديو' : 'مستند'}
                  </Badge>
                ) : null}
              </div>
            </div>
            {sorted.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {sorted.map((image, index) => (
                  <button
                    key={image.id || `${image.url}-${image.sortOrder}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={
                      index === activeIndex
                        ? 'relative overflow-hidden rounded-md ring-2 ring-brand-500'
                        : 'relative overflow-hidden rounded-md border border-border'
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={`${title} ${index + 1}`}
                      className="h-16 w-full object-cover"
                    />
                    {image.type === 'VIDEO' ? (
                      <span className="absolute bottom-1 start-1 rounded bg-ink-900/70 px-1 text-[10px] text-white">
                        فيديو
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
