'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { marketingServicesCopy } from '../config';

interface MarketingMediaProps {
  src: string;
  alt: string;
  kind: 'image' | 'video';
  className?: string;
  priority?: boolean;
}

export function MarketingMedia({
  src,
  alt,
  kind,
  className,
  priority = false,
}: MarketingMediaProps) {
  const [playing, setPlaying] = useState(false);

  if (kind === 'image') {
    return (
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-lg bg-surface-100',
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 520px"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-lg bg-ink-950',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover opacity-90"
        sizes="(max-width: 1024px) 100vw, 520px"
        priority={priority}
      />
      {playing ? (
        <div
          role="status"
          className="absolute inset-0 flex items-center justify-center bg-ink-950/70 px-6 text-center text-sm font-semibold text-white"
        >
          {marketingServicesCopy.videoDemoMessage}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          aria-label={marketingServicesCopy.videoPlayLabel}
        >
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700">
            <Play size={28} fill="currentColor" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
