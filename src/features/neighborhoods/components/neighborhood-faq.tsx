'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { neighborhoodCopy } from '../config';
import type { NeighborhoodFaqItem } from '../types';

interface NeighborhoodFaqProps {
  items: NeighborhoodFaqItem[];
}

export function NeighborhoodFaq({ items }: NeighborhoodFaqProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  if (!items.length) return null;

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950">
        {neighborhoodCopy.faqTitle}
      </h2>
      <div className="mt-4 divide-y divide-[#ececec] rounded-lg border border-[#e8e8e8] bg-white">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="text-sm font-bold text-ink-900">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-ink-500 transition-transform',
                    open && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
              {open ? (
                <div className="px-4 pb-4 text-sm leading-7 text-ink-600">
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
