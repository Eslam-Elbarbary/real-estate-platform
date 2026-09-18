'use client';

import { Suspense, type ComponentProps } from 'react';
import { PropertyWizard } from './property-wizard';

function WizardFallback() {
  return (
    <div className="rounded-xl border border-border bg-white p-6 text-sm text-ink-500">
      جاري تحميل المعالج…
    </div>
  );
}

/** Suspense boundary required for useSearchParams step state. */
export function PropertyWizardShell(props: ComponentProps<typeof PropertyWizard>) {
  return (
    <Suspense fallback={<WizardFallback />}>
      <PropertyWizard {...props} />
    </Suspense>
  );
}
