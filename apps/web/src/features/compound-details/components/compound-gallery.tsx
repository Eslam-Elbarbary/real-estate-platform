'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { CompoundGalleryImage } from '@/types';
import { cn } from '@/lib/utils/cn';

interface CompoundGalleryProps {
  images: CompoundGalleryImage[];
  title: string;
  className?: string;
}

export function CompoundGallery({
  images,
  title,
  className,
}: CompoundGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: 'rtl',
    loop: true,
    align: 'center',
  });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('init', onSelect);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    queueMicrotask(onSelect);
    return () => {
      emblaApi.off('init', onSelect);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images.length) {
    return null;
  }

  return (
    <div className={cn('relative overflow-hidden rounded-[12px]', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative min-w-0 shrink-0 grow-0 basis-full"
            >
              <div className="relative aspect-[1.65] w-full bg-surface-100">
                <Image
                  src={image.src}
                  alt={image.alt || title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 780px"
                  className="object-cover"
                  priority={image.order === 1}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute start-3 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-800 shadow-md transition hover:bg-surface-50"
            aria-label="الصورة السابقة"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute end-3 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-800 shadow-md transition hover:bg-surface-50"
            aria-label="الصورة التالية"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <div
            dir="ltr"
            className="absolute bottom-3 start-3 z-10 rounded-md bg-ink-950/70 px-2.5 py-1 text-[12px] font-semibold tabular-nums text-white"
          >
            {index + 1} / {images.length}
          </div>
        </>
      ) : null}
    </div>
  );
}
