import Image from 'next/image';
import type { ReactNode } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { valuationCopy } from '../config';
import { formatStepProgress } from '../lib/format';

interface ValuationWizardShellProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

export function ValuationHero() {
  return (
    <section className="border-b border-[#edd9a8]/bg-[#fff6e0]">
      <Container className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-12">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl">
            <Image
              src="/assets/valuation/wizard-hero.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            <Sparkles size={14} aria-hidden />
            {valuationCopy.aiBadge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-snug text-ink-950 lg:text-4xl">
            {valuationCopy.publicTitle}
          </h1>
          <ul className="mt-6 space-y-3">
            {valuationCopy.benefits.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink-800">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-700">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function ValuationWizardShell({
  currentStep,
  totalSteps,
  children,
}: ValuationWizardShellProps) {
  const progress = formatStepProgress(currentStep, totalSteps);

  return (
    <div className="bg-[#faf7f1]">
      <ValuationHero />
      <Container className="py-8 lg:py-10">
        <div className="mx-auto mb-5 flex max-w-3xl items-center justify-between gap-4 text-sm font-semibold text-ink-700">
          <span>{progress.label}</span>
          <span>{progress.percent}%</span>
        </div>
        <div
          className="mx-auto mb-6 h-2 max-w-3xl overflow-hidden rounded-full bg-surface-200"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
          {children}
        </div>
      </Container>
    </div>
  );
}
