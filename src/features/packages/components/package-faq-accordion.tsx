'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { PackageFaqItem } from '../config/faq-terms';

interface PackageFaqAccordionProps {
  items: PackageFaqItem[];
}

export function PackageFaqAccordion({ items }: PackageFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-[#e5e5e5]">
      {items.map((item) => {
        const open = openId === item.id;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-button-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="text-sm font-bold text-ink-900 sm:text-[0.95rem]">
                  {item.question}
                </span>
                <span
                  className={cn(
                    'inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-brand-700',
                    open ? 'border-brand-200 bg-brand-50' : 'border-[#e0e0e0] bg-white',
                  )}
                  aria-hidden
                >
                  {open ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className={cn(!open && 'hidden')}
            >
              <p className="pb-4 pe-10 text-sm leading-7 text-ink-600">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
