'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PackageModalShell } from '@/features/packages/components/package-modal-shell';
import { researchCopy } from '../config';
import type { ResearchVideo } from '../types';

interface ResearchVideoSectionProps {
  videos: ResearchVideo[];
}

export function ResearchVideoSection({ videos }: ResearchVideoSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openVideo = videos.find((item) => item.id === openId);

  return (
    <section className="mt-16" aria-labelledby="research-videos-heading">
      <h2
        id="research-videos-heading"
        className="text-center text-xl font-extrabold text-ink-950"
      >
        {researchCopy.videosHeading}
      </h2>
      <ul className="mx-auto mt-8 flex max-w-[820px] flex-col gap-10">
        {videos.map((video) => (
          <li key={video.id}>
            <h3 className="mb-3 text-center text-base font-bold text-ink-900">
              {video.title}
            </h3>
            <button
              type="button"
              onClick={() => setOpenId(video.id)}
              className="relative block aspect-video w-full overflow-hidden bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={`تشغيل: ${video.title}`}
            >
              <Image
                src={video.posterSrc}
                alt={video.posterAlt}
                fill
                className="object-cover"
                sizes="(max-width: 820px) 100vw, 820px"
              />
              <span className="absolute inset-0 bg-ink-950/25" />
              <span
                aria-hidden
                className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-md"
              >
                <svg viewBox="0 0 24 24" className="ms-1 size-8 fill-current">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <PackageModalShell
        open={Boolean(openVideo)}
        onClose={() => setOpenId(null)}
        title={researchCopy.videoModalTitle}
        size="md"
        testId="research-video-modal"
      >
        <p className="py-6 text-sm leading-7 text-ink-600">
          {researchCopy.videoModalBody}
        </p>
      </PackageModalShell>
    </section>
  );
}
