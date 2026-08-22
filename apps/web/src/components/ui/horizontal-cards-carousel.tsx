'use client';

import {
  Children,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface HorizontalCardsCarouselProps {
  children: ReactNode;
  className?: string;
  slideClassName?: string;
  ariaLabel?: string;
}

export function HorizontalCardsCarousel({
  children,
  className,
  slideClassName,
  ariaLabel,
}: HorizontalCardsCarouselProps) {
  const slides = Children.toArray(children);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: 'rtl',
    align: 'start',
    slidesToScroll: 1,
    loop: false,
    dragFree: false,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncButtons = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.on('init', syncButtons);
    emblaApi.on('select', syncButtons);
    emblaApi.on('reInit', syncButtons);
    queueMicrotask(syncButtons);

    return () => {
      emblaApi.off('init', syncButtons);
      emblaApi.off('select', syncButtons);
      emblaApi.off('reInit', syncButtons);
    };
  }, [emblaApi, syncButtons]);

  return (
    <div className={cn('relative', className)} dir="rtl">
      <div className="overflow-hidden" ref={emblaRef} aria-label={ariaLabel}>
        <div className="flex touch-pan-y">
          {slides.map((child, index) => (
            <div
              key={index}
              className={cn(
                'min-w-0 shrink-0 grow-0',
                'basis-[78%] pe-[22px] sm:basis-[46%] md:basis-[31%] lg:basis-[21.5%] xl:basis-[18.4%] 2xl:basis-[18.2%]',
                slideClassName,
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {canPrev ? (
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label={uiLabels.carouselPrev}
          className="absolute top-1/2 start-0 z-10 inline-flex size-9 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-black/8 bg-white text-ink-900 shadow-[0_1px_4px_rgba(0,0,0,0.12)] transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </button>
      ) : null}

      {canNext ? (
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label={uiLabels.carouselNext}
          className="absolute top-1/2 end-0 z-10 inline-flex size-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-black/8 bg-white text-ink-900 shadow-[0_1px_4px_rgba(0,0,0,0.12)] transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronLeft className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
