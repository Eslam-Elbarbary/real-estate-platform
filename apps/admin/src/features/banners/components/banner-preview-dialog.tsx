'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { AdminBanner } from '../types';

interface BannerPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banners: AdminBanner[];
}

/**
 * Lightweight admin preview of active HOME_HERO banners.
 * Uses interval rotation (no Embla dependency in admin).
 */
export function BannerPreviewDialog({
  open,
  onOpenChange,
  banners,
}: BannerPreviewDialogProps) {
  const slides = banners
    .filter((banner) => banner.isActive && banner.position === 'HOME_HERO')
    .sort((a, b) => a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt));

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
  }, [open, slides.length]);

  useEffect(() => {
    if (!open || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [open, slides.length]);

  const active = slides[index];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="معاينة سلايدر الرئيسية"
      description={
        slides.length === 0
          ? 'لا توجد بنرات نشطة في موضع الرئيسية - Hero.'
          : `${slides.length.toLocaleString('ar-EG')} بنر نشط`
      }
      className="max-w-3xl"
    >
      {active ? (
        <div className="space-y-3">
          <div className="relative h-56 overflow-hidden rounded-xl bg-ink-900 sm:h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.imageUrl}
              alt={active.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-1 p-4 text-white">
              <p className="text-lg font-bold">{active.title}</p>
              {active.description ? (
                <p className="text-sm text-white/90">{active.description}</p>
              ) : null}
            </div>
          </div>
          {slides.length > 1 ? (
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                size="small"
                variant="outline"
                onClick={() =>
                  setIndex((current) => (current - 1 + slides.length) % slides.length)
                }
              >
                السابق
              </Button>
              <div className="flex gap-1.5" dir="ltr">
                {slides.map((slide, dotIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`معاينة ${dotIndex + 1}`}
                    onClick={() => setIndex(dotIndex)}
                    className={`h-2 rounded-full transition-all ${
                      dotIndex === index ? 'w-5 bg-brand-600' : 'w-2 bg-ink-300'
                    }`}
                  />
                ))}
              </div>
              <Button
                type="button"
                size="small"
                variant="outline"
                onClick={() => setIndex((current) => (current + 1) % slides.length)}
              >
                التالي
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-ink-500">فعّل بنرًا واحدًا على الأقل للمعاينة.</p>
      )}
    </Dialog>
  );
}
