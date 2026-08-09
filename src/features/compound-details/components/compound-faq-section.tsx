'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { CompoundFaqItem } from '@/types';
import { cn } from '@/lib/utils/cn';

interface CompoundFaqSectionProps {
  items: CompoundFaqItem[];
  className?: string;
}

export function CompoundFaqSection({
  items,
  className,
}: CompoundFaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        {uiLabels.compoundDetailsFaqTitle}
      </h2>

      <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-white">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start"
              >
                <span className="text-[14px] font-semibold text-ink-900">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-ink-500 transition-transform',
                    open && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
              {open ? (
                <div className="px-4 pb-4 text-[13px] leading-7 text-ink-600">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
