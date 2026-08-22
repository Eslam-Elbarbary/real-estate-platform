'use client';

import { useState } from 'react';
import { uiLabels } from '@/config/labels';

interface DescriptionSectionProps {
  description: string;
}

const COLLAPSE_LENGTH = 240;

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = description.length > COLLAPSE_LENGTH;
  const visibleText =
    !canCollapse || expanded
      ? description
      : `${description.slice(0, COLLAPSE_LENGTH).trimEnd()}…`;

  return (
    <section className="pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.descriptionSectionTitle}
      </h2>
      <p className="mt-5 max-w-none text-[15px] font-normal leading-9 text-ink-700">
        {visibleText}
      </p>
      {canCollapse ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          {expanded ? uiLabels.showLess : uiLabels.showMore}
        </button>
      ) : null}
    </section>
  );
}
