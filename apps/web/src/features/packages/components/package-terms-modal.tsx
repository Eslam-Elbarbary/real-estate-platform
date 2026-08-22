'use client';

import { packagePageCopy } from '../config/catalog';
import type { PackageTermsContent } from '../config/faq-terms';
import { PackageModalShell } from './package-modal-shell';

interface PackageTermsModalProps {
  open: boolean;
  onClose: () => void;
  terms: PackageTermsContent;
}

export function PackageTermsModal({
  open,
  onClose,
  terms,
}: PackageTermsModalProps) {
  return (
    <PackageModalShell
      open={open}
      onClose={onClose}
      title={packagePageCopy.terms}
      size="lg"
      testId="package-terms-modal"
    >
      <div className="space-y-4 py-2 text-sm leading-7 text-ink-700">
        <p>{terms.intro}</p>
        <ul className="list-disc space-y-2 pe-5">
          {terms.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="rounded-md bg-surface-50 px-3 py-2 text-xs font-semibold text-ink-600">
          {terms.disclaimer}
        </p>
      </div>
    </PackageModalShell>
  );
}
