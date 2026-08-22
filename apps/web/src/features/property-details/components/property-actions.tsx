'use client';

import { useState } from 'react';
import { Bookmark, Flag, NotebookPen, Share2 } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface PropertyActionsProps {
  title: string;
  className?: string;
}

export function PropertyActions({ title, className }: PropertyActionsProps) {
  const [saved, setSaved] = useState(false);
  const [noted, setNoted] = useState(false);
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

  const actions = [
    {
      key: 'save',
      label: uiLabels.saveAction,
      icon: Bookmark,
      tone: 'brand' as const,
      active: saved,
      onClick: () => setSaved((value) => !value),
    },
    {
      key: 'note',
      label: uiLabels.noteAction,
      icon: NotebookPen,
      tone: 'brand' as const,
      active: noted,
      onClick: () => setNoted((value) => !value),
    },
    {
      key: 'share',
      label: uiLabels.shareAction,
      icon: Share2,
      tone: 'brand' as const,
      active: false,
      onClick: () => {
        void share();
      },
    },
    {
      key: 'report',
      label: uiLabels.reportAction,
      icon: Flag,
      tone: 'danger' as const,
      active: false,
      onClick: () => undefined,
    },
  ];

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-surface-50',
                action.tone === 'danger'
                  ? 'text-danger-600 hover:text-danger-700'
                  : 'text-brand-700 hover:text-brand-600',
                action.active && 'bg-brand-50',
              )}
            >
              <Icon
                className={cn(
                  'size-[18px]',
                  action.active && action.tone !== 'danger' && 'fill-brand-600',
                )}
                aria-hidden
              />
              {action.label}
            </button>
          );
        })}
      </div>
      {feedback ? (
        <p className="absolute top-full start-0 mt-1 text-xs font-medium text-brand-700">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
