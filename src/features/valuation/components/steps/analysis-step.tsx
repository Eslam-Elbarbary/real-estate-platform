'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { valuationCopy } from '../../config';
import type { ValuationStepContext } from '../../wizard/steps';

const ANALYSIS_MS = 1100;

export function AnalysisStep({ onAnalysisComplete }: ValuationStepContext) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    let cancelled = false;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      const t = window.setTimeout(() => {
        if (!cancelled) onAnalysisComplete?.();
      }, 200);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }

    const started = performance.now();
    let frame = 0;
    let done = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - started;
      const next = Math.min(100, Math.round((elapsed / ANALYSIS_MS) * 100));
      setProgress(next);
      if (elapsed >= ANALYSIS_MS) {
        if (!done) {
          done = true;
          onAnalysisComplete?.();
        }
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [onAnalysisComplete]);

  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="relative mb-6 size-24 overflow-hidden rounded-2xl">
        <Image
          src="/assets/valuation/analysis.webp"
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <h2 className="text-xl font-extrabold text-ink-950">
        {valuationCopy.analysisText}
      </h2>
      <div
        className="mt-6 h-2 w-48 overflow-hidden rounded-full bg-surface-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-150 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-ink-500">{valuationCopy.demoDisclaimer}</p>
    </div>
  );
}
