'use client';

import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { PublicBanner } from '../types';

const AUTOPLAY_MS = 5500;

interface HeroBannerSliderProps {
  banners: PublicBanner[];
  /** Static fallback when banners is empty */
  fallback: {
    title: string;
    description: string;
    desktopImage: string;
    mobileImage: string;
  };
  children?: React.ReactNode;
  className?: string;
}

function BannerSlideMedia({
  desktop,
  mobile,
  alt,
  priority,
}: {
  desktop: string;
  mobile: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={desktop}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="hidden object-cover object-[62%_center] md:block md:object-center"
        unoptimized={desktop.startsWith('http')}
      />
      <Image
        src={mobile}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-[62%_center] md:hidden"
        unoptimized={mobile.startsWith('http')}
      />
    </>
  );
}

export function HeroBannerSlider({
  banners,
  fallback,
  children,
  className,
}: HeroBannerSliderProps) {
  const slides =
    banners.length > 0
      ? banners
      : [
          {
            id: 'fallback',
            title: fallback.title,
            description: fallback.description,
            imageUrl: fallback.desktopImage,
            mobileImageUrl: fallback.mobileImage,
            buttonText: null,
            buttonUrl: null,
            sortOrder: 0,
          } satisfies PublicBanner,
        ];

  const multi = slides.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: 'rtl',
    loop: multi,
    align: 'start',
    duration: 28,
  });
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

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

  useEffect(() => {
    if (!emblaApi || !multi) return;

    const timer = window.setInterval(() => {
      if (!pausedRef.current) {
        emblaApi.scrollNext();
      }
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [emblaApi, multi]);

  const active = slides[index] ?? slides[0]!;
  const hasCta = Boolean(active.buttonText?.trim() && active.buttonUrl?.trim());

  return (
    <div
      className={cn(
        'relative h-[420px] overflow-hidden rounded-[12px] min-[430px]:h-[440px] sm:h-[420px] lg:h-[440px] xl:h-[460px]',
        className,
      )}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          pausedRef.current = false;
        }
      }}
    >
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, slideIndex) => {
            const desktop = slide.imageUrl;
            const mobile = slide.mobileImageUrl?.trim() || desktop;
            return (
              <div
                key={slide.id}
                className="relative min-w-0 shrink-0 grow-0 basis-full"
              >
                <BannerSlideMedia
                  desktop={desktop}
                  mobile={mobile}
                  alt={slide.title}
                  priority={slideIndex === 0}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/22 to-black/14 sm:from-black/55 sm:via-black/30 sm:to-black/20" />

      <div className="absolute inset-0 flex flex-col items-center px-0 pb-6 pt-9 sm:px-8 sm:pb-7 sm:pt-10">
        <div className="flex w-[90%] max-w-[22rem] flex-col items-center text-center sm:w-full sm:max-w-none sm:flex-1 sm:justify-center">
          <h1 className="max-w-[90%] text-[1.7rem] font-bold leading-[1.25] text-white drop-shadow-sm transition-opacity duration-300 sm:max-w-none sm:text-[1.95rem] lg:text-[2.1rem]">
            {active.title}
          </h1>
          {active.description ? (
            <p className="mt-3 inline-flex h-9 max-w-full items-center rounded-full bg-black/45 px-4 text-sm leading-none text-white backdrop-blur-sm sm:mt-3.5 sm:h-auto sm:px-5 sm:py-2 sm:text-[15px] sm:leading-normal">
              {active.description}
            </p>
          ) : null}
          {hasCta ? (
            <Link
              href={active.buttonUrl!}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700"
            >
              {active.buttonText}
            </Link>
          ) : null}
        </div>

        {children}
      </div>

      {multi ? (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute start-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55 sm:inline-flex"
            aria-label="البنر السابق"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute end-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55 sm:inline-flex"
            aria-label="البنر التالي"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <div
            dir="ltr"
            className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-32"
            role="tablist"
            aria-label="بنرات الصفحة الرئيسية"
          >
            {slides.map((slide, dotIndex) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`عرض البنر ${dotIndex + 1}`}
                onClick={() => emblaApi?.scrollTo(dotIndex)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  dotIndex === index
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/55 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
