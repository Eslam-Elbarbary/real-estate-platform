'use client';

import { useMemo, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils/cn';
import type { AdminPropertyImage } from '../types';

interface PropertyGalleryProps {
  images: AdminPropertyImage[];
  title: string;
  className?: string;
}

export function PropertyGallery({
  images,
  title,
  className,
}: PropertyGalleryProps) {
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

  const imageCount = sorted.filter((item) => item.type === 'IMAGE').length;
  const videoCount = sorted.filter((item) => item.type === 'VIDEO').length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const active = sorted[activeIndex] ?? sorted[0];

  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-ink-900">المعرض</h2>
          <p className="mt-0.5 text-sm text-ink-500">
            {sorted.length === 0
              ? 'لا توجد وسائط مرفوعة'
              : [
                  imageCount > 0
                    ? `${imageCount.toLocaleString('ar-EG')} صورة`
                    : null,
                  videoCount > 0
                    ? `${videoCount.toLocaleString('ar-EG')} فيديو`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
          </p>
        </div>
      </div>

      {sorted.length === 0 || !active ? (
        <EmptyState
          title="لا توجد وسائط"
          description="لم يتم إرفاق صور أو فيديوهات لهذا العقار بعد."
          icon={<ImageIcon className="size-5" aria-hidden />}
          className="py-14"
        />
      ) : (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-50">
            {!heroLoaded && active.type === 'IMAGE' ? (
              <div
                className="absolute inset-0 animate-pulse bg-surface-100"
                aria-hidden
              />
            ) : null}

            {active.type === 'VIDEO' ? (
              <video
                key={active.id}
                src={active.url}
                controls
                className="aspect-[16/9] max-h-[28rem] w-full bg-ink-900 object-contain"
                onLoadedData={() => setHeroLoaded(true)}
              >
                <track kind="captions" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={active.id}
                src={active.url}
                alt={title}
                className="aspect-[16/9] max-h-[28rem] w-full object-cover"
                onLoad={() => setHeroLoaded(true)}
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
            <div className="-mx-1 overflow-x-auto px-1 pb-1">
              <div className="flex min-w-max gap-2">
                {sorted.map((image, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={image.id || `${image.url}-${image.sortOrder}`}
                      type="button"
                      onClick={() => {
                        setActiveIndex(index);
                        setHeroLoaded(false);
                      }}
                      className={cn(
                        'relative size-16 shrink-0 overflow-hidden rounded-lg border sm:size-20',
                        selected
                          ? 'border-brand-500 ring-2 ring-brand-500'
                          : 'border-border hover:border-brand-300',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={`${title} ${index + 1}`}
                        className="size-full object-cover"
                      />
                      {image.type === 'VIDEO' ? (
                        <span className="absolute bottom-1 start-1 rounded bg-ink-900/70 px-1 text-[10px] text-white">
                          فيديو
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
