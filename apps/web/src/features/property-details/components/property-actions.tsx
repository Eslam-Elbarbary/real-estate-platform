'use client';

import { useState } from 'react';
import { Flag, NotebookPen, Share2 } from 'lucide-react';
import { FavoriteButton } from '@/features/activity/favorites/favorite-button';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface PropertyActionsProps {
  propertyId: string;
  title: string;
  initialIsFavorite?: boolean;
  className?: string;
}

export function PropertyActions({
  propertyId,
  title,
  initialIsFavorite = false,
  className,
}: PropertyActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const share = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setFeedback(uiLabels.linkCopied);
      window.setTimeout(() => setFeedback(null), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback(uiLabels.linkCopied);
        window.setTimeout(() => setFeedback(null), 2000);
      } catch {
        setFeedback(null);
      }
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <FavoriteButton
          propertyId={propertyId}
          initialIsFavorite={initialIsFavorite}
          variant="action"
        />

        <button
          type="button"
          disabled
          aria-disabled
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-semibold text-ink-400"
        >
          <NotebookPen className="size-[18px]" aria-hidden />
          {uiLabels.noteAction}
        </button>

        <button
          type="button"
          onClick={() => {
            void share();
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-surface-50 hover:text-brand-600"
        >
          <Share2 className="size-[18px]" aria-hidden />
          {uiLabels.shareAction}
        </button>

        <button
          type="button"
          disabled
          aria-disabled
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-semibold text-ink-400"
        >
          <Flag className="size-[18px]" aria-hidden />
          {uiLabels.reportAction}
        </button>
      </div>
      {feedback ? (
        <p className="absolute top-full start-0 mt-1 text-xs font-medium text-brand-700">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
