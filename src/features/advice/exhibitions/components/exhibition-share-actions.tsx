'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { siteConfig } from '@/config/site';
import { exhibitionCopy } from '../config';

interface ExhibitionShareActionsProps {
  title: string;
  path: string;
}

export function ExhibitionShareActions({ title, path }: ExhibitionShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const url = new URL(path, siteConfig.url).toString();
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title, url, text: title });
    } catch {
      // User cancelled share.
    }
  }

  return (
    <section className="mt-10" aria-labelledby="exhibition-share-heading">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="exhibition-share-heading" className="text-sm font-extrabold text-ink-950">
          {exhibitionCopy.share}:
        </h2>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink-700 px-3 text-xs font-bold text-white hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? exhibitionCopy.copied : exhibitionCopy.copyLink}
        </button>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noreferrer"
          aria-label={exhibitionCopy.facebook}
          className="inline-flex size-9 items-center justify-center rounded-md bg-[#1877f2] text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <FaFacebookF className="size-3.5" aria-hidden />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
          target="_blank"
          rel="noreferrer"
          aria-label={exhibitionCopy.twitter}
          className="inline-flex size-9 items-center justify-center rounded-md bg-ink-950 text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <FaXTwitter className="size-3.5" aria-hidden />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noreferrer"
          aria-label={exhibitionCopy.linkedin}
          className="inline-flex size-9 items-center justify-center rounded-md bg-[#0a66c2] text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <FaLinkedinIn className="size-3.5" aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => void nativeShare()}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#e4e4e4] px-3 text-xs font-semibold text-ink-700 hover:border-brand-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Share2 className="size-3.5" aria-hidden />
          {exhibitionCopy.share}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? exhibitionCopy.copied : ''}
      </p>
    </section>
  );
}
