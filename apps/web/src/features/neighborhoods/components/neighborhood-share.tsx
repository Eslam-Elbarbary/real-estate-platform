'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { neighborhoodCopy } from '../config';

interface NeighborhoodShareProps {
  name: string;
  url: string;
}

export function NeighborhoodShare({ name, url }: NeighborhoodShareProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950">
        {neighborhoodCopy.sharePrefix} {name}
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          aria-label="رابط المشاركة"
          className="h-11 w-full flex-1 rounded-md border border-[#d9d9d9] bg-white px-3 text-sm text-ink-700"
          dir="ltr"
        />
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? neighborhoodCopy.copied : neighborhoodCopy.copyLink}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? neighborhoodCopy.copied : ''}
      </p>
    </section>
  );
}
