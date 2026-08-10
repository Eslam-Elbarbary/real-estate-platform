'use client';

import { packagePageCopy } from '../config/catalog';
import type { PackageFaqItem } from '../config/faq-terms';
import { PackageFaqAccordion } from './package-faq-accordion';
import { PackageModalShell } from './package-modal-shell';

interface PackageFaqModalProps {
  open: boolean;
  onClose: () => void;
  items: PackageFaqItem[];
}

export function PackageFaqModal({ open, onClose, items }: PackageFaqModalProps) {
  return (
    <PackageModalShell
      open={open}
      onClose={onClose}
      title={packagePageCopy.faq}
      size="lg"
      testId="package-faq-modal"
    >
      <PackageFaqAccordion items={items} />
    </PackageModalShell>
  );
}
