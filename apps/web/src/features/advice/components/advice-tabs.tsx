import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { adviceViewOptions } from '../config';
import { buildAdviceAskPath } from '../search-params';
import type { AdviceQuestionFilters } from '../types';

interface AdviceTabsProps {
  filters: AdviceQuestionFilters;
}

export function AdviceTabs({ filters }: AdviceTabsProps) {
  return (
    <nav
      aria-label="عرض الأسئلة"
      className="mt-4 flex gap-5 border-b border-[#ececec]"
    >
      {adviceViewOptions.map((option) => {
        const active = filters.view === option.value;
        return (
          <Link
            key={option.value}
            href={buildAdviceAskPath({
              ...filters,
              view: option.value,
              page: 1,
            })}
            aria-current={active ? 'page' : undefined}
            className={cn(
              '-mb-px border-b-2 pb-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              active
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-ink-500 hover:text-ink-800',
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
