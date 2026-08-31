'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
        <h2 className="text-base font-semibold text-ink-900">الصور</h2>
        <p className="text-sm text-ink-500">
          {sorted.length > 0
            ? `${sorted.length.toLocaleString('ar-EG')} صورة`
            : 'لا توجد صور مرفوعة'}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.length === 0 || !active ? (
          <div className="flex h-56 items-center justify-center rounded-md border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد صور لهذا العقار.
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-md border border-border bg-surface-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.url}
                alt={title}
                className="h-72 w-full object-cover"
              />
              {active.isPrimary ? (
                <Badge variant="brand" className="absolute start-3 top-3">
                  الصورة الرئيسية
                </Badge>
              ) : null}
            </div>
            {sorted.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {sorted.map((image, index) => (
                  <button
                    key={`${image.url}-${image.sortOrder}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={
                      index === activeIndex
                        ? 'overflow-hidden rounded-md ring-2 ring-brand-500'
                        : 'overflow-hidden rounded-md border border-border'
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={`${title} ${index + 1}`}
                      className="h-16 w-full object-cover"
                    />
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
