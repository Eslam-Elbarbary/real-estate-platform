'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import type { PropertyGalleryImage } from '@/types';

interface PropertyGalleryProps {
  images: PropertyGalleryImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ordered = [...images].sort((a, b) => a.order - b.order);
  const cover = ordered.find((image) => image.isCover) ?? ordered[0];
  const sideImages = ordered.filter((image) => image.id !== cover?.id).slice(0, 4);
  const remaining = Math.max(0, ordered.length - (1 + sideImages.length));

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) =>
          current === null ? current : (current + 1) % ordered.length,
        );
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) =>
          current === null
            ? current
            : (current - 1 + ordered.length) % ordered.length,
        );
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, ordered.length]);

  if (!cover) {
    return null;
  }

  const openAt = (imageId: string) => {
    const index = ordered.findIndex((image) => image.id === imageId);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  return (
    <section id="photos" className="scroll-mt-28">
      <div className="overflow-hidden rounded-[12px] bg-white">
        <div className="grid gap-[5px] lg:h-[530px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <button
            type="button"
            onClick={() => openAt(cover.id)}
            className="relative aspect-[16/10] overflow-hidden bg-surface-100 lg:aspect-auto lg:h-full"
          >
            <Image
              src={cover.url}
              alt={cover.alt || title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </button>

          <div className="grid grid-cols-2 grid-rows-2 gap-[5px] lg:h-full">
            {sideImages.map((image, index) => {
              const isLast = index === sideImages.length - 1;
              const overlayCount = remaining + (isLast ? 1 : 0);
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => openAt(image.id)}
                  className="relative aspect-[4/3] overflow-hidden bg-surface-100 lg:aspect-auto lg:h-full"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 22vw"
                    className="object-cover"
                  />
                  {isLast ? (
                    <span className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-1.5 rounded-md bg-black/55 px-3 py-2 text-xs font-bold text-white backdrop-blur-[1px] sm:inset-x-auto sm:start-3 sm:text-sm">
                      <Images className="size-4" aria-hidden />
                      {uiLabels.viewAllPhotos}
                      {overlayCount > 0 ? ` (+${overlayCount})` : ''}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {lightboxIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={uiLabels.viewAllPhotos}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            aria-label={uiLabels.closeMenu}
            className="absolute top-4 end-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            aria-label={uiLabels.carouselNext}
            className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((current) =>
                current === null ? 0 : (current + 1) % ordered.length,
              );
            }}
          >
            <ChevronRight className="size-6" />
          </button>

          <button
            type="button"
            aria-label={uiLabels.carouselPrev}
            className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((current) =>
                current === null
                  ? 0
                  : (current - 1 + ordered.length) % ordered.length,
              );
            }}
          >
            <ChevronLeft className="size-6" />
          </button>

          <div
            className={cn('relative h-[75vh] w-full max-w-5xl')}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={ordered[lightboxIndex].url}
              alt={ordered[lightboxIndex].alt || title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-5 text-sm font-medium text-white/90">
            {lightboxIndex + 1} / {ordered.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}
