'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

export function AiRecommendationBanner({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Sparkles className="size-4 shrink-0 text-brand-600" aria-hidden />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink-900">
              {uiLabels.aiResultsTitle}
            </p>
            <span className="inline-flex rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {uiLabels.proBadge}
            </span>
          </div>
          <p className="mt-0.5 text-xs leading-5 text-ink-600">
            {uiLabels.aiResultsDescription}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={uiLabels.aiResultsTitle}
        onClick={() => setEnabled((current) => !current)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          enabled ? 'bg-brand-600' : 'bg-surface-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[inset-inline-start]',
            enabled ? 'start-[22px]' : 'start-0.5',
          )}
        />
      </button>
    </div>
  );
}
