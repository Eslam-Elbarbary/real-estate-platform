'use client';

import { useState } from 'react';
import { packagePageCopy } from '../config/catalog';
import {
  resolvePackageFaqs,
  resolvePackageTerms,
  type PackageFaqItem,
  type PackageTermsContent,
} from '../config/faq-terms';
import { PackageFaqModal } from './package-faq-modal';
import { PackageTermsModal } from './package-terms-modal';

interface PackageInfoActionsProps {
  faqs?: PackageFaqItem[];
  terms?: PackageTermsContent;
}

type InfoModal = 'faq' | 'terms' | null;

const triggerClass =
  'inline-flex h-10 items-center rounded-full border border-[#e5e5e5] bg-surface-50 px-5 text-sm font-semibold text-ink-700 transition-colors hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export function PackageInfoActions({ faqs, terms }: PackageInfoActionsProps) {
  const [open, setOpen] = useState<InfoModal>(null);
  const resolvedFaqs = resolvePackageFaqs(faqs);
  const resolvedTerms = resolvePackageTerms(terms);

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className={triggerClass}
          data-testid="package-faq-trigger"
          onClick={() => setOpen('faq')}
        >
          {packagePageCopy.faq}
        </button>
        <button
          type="button"
          className={triggerClass}
          data-testid="package-terms-trigger"
          onClick={() => setOpen('terms')}
        >
          {packagePageCopy.terms}
        </button>
      </div>

      <PackageFaqModal
        open={open === 'faq'}
        onClose={() => setOpen(null)}
        items={resolvedFaqs}
      />
      <PackageTermsModal
        open={open === 'terms'}
        onClose={() => setOpen(null)}
        terms={resolvedTerms}
      />
    </>
  );
}
