'use client';

import { useState } from 'react';
import Image from 'next/image';
import { neighborhoodCopy } from '../config';

interface NeighborhoodAboutProps {
  name: string;
  description: string;
  image?: string;
}

export function NeighborhoodAbout({
  name,
  description,
  image,
}: NeighborhoodAboutProps) {
  const [expanded, setExpanded] = useState(false);
  const long = description.length > 220;
  const text =
    !expanded && long ? `${description.slice(0, 220).trim()}…` : description;

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950">
        {neighborhoodCopy.aboutPrefix} {name}
      </h2>
      <div className="mt-5 grid items-start gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm leading-7 text-ink-700 sm:text-[15px]">{text}</p>
          {long ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 text-sm font-bold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {expanded ? 'عرض أقل' : neighborhoodCopy.readMore}
            </button>
          ) : null}
        </div>
        {image ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-100">
            <Image
              src={image}
              alt={`صورة من ${name}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
