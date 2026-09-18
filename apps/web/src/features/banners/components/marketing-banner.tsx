'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PublicBanner } from '../types';

interface MarketingBannerProps {
  banner: PublicBanner;
  className?: string;
  priority?: boolean;
  overlay?: boolean;
  children?: React.ReactNode;
}

export function MarketingBanner({
  banner,
  className,
  priority = false,
  overlay = true,
  children,
}: MarketingBannerProps) {
  const desktopSrc = banner.imageUrl;
  const mobileSrc = banner.mobileImageUrl?.trim() || desktopSrc;
  const hasCta = Boolean(banner.buttonText?.trim() && banner.buttonUrl?.trim());

  return (
    <div className={className}>
      <div className="relative h-full w-full overflow-hidden">
        {/* Desktop */}
        <Image
          src={desktopSrc}
          alt={banner.title}
          fill
          priority={priority}
          sizes="100vw"
          className="hidden object-cover md:block"
          unoptimized={desktopSrc.startsWith('http')}
        />
        {/* Mobile */}
        <Image
          src={mobileSrc}
          alt={banner.title}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover md:hidden"
          unoptimized={mobileSrc.startsWith('http')}
        />

        {overlay ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-black/15" />
        ) : null}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-white">
          {banner.title ? (
            <h2 className="max-w-3xl text-2xl font-bold drop-shadow-sm sm:text-3xl">
              {banner.title}
            </h2>
          ) : null}
          {banner.description ? (
            <p className="max-w-2xl text-sm text-white/90 sm:text-base">
              {banner.description}
            </p>
          ) : null}
          {hasCta ? (
            <Link
              href={banner.buttonUrl!}
              className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700"
            >
              {banner.buttonText}
            </Link>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
