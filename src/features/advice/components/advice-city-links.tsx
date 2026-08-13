'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { NeighborhoodPropertyLink } from '@/features/neighborhoods/types';
import type { TransactionType } from '@/types';
import { adviceCopy } from '../config';
import { buildAdviceAskPath } from '../search-params';
import type { AdviceQuestionFilters } from '../types';
import { AdviceSectionHeading } from './advice-breadcrumb';

interface AdviceCityLinksProps {
  title?: string;
  links: NeighborhoodPropertyLink[];
  filters: AdviceQuestionFilters;
  pathname?: string;
}

export function AdviceCityLinks({
  title = adviceCopy.citiesSectionTitle,
  links,
  filters,
  pathname,
}: AdviceCityLinksProps) {
  const router = useRouter();
  const transaction = filters.transaction;
  const filtered = links.filter((link) => link.transaction === transaction);
  const visible = filtered.length ? filtered : links;

  function setTransaction(next: TransactionType) {
    router.push(buildAdviceAskPath({ ...filters, transaction: next }, pathname));
  }

  if (!links.length) return null;

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdviceSectionHeading as="h2" className="text-lg sm:text-xl">
          {title}
        </AdviceSectionHeading>
        <div
          role="group"
          aria-label="نوع المعاملة"
          className="inline-flex overflow-hidden rounded-full border border-[#ddd]"
        >
          {(['sale', 'rent'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTransaction(value)}
              aria-pressed={transaction === value}
              className={cn(
                'px-4 py-1.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                transaction === value
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-ink-700',
              )}
            >
              {value === 'sale' ? adviceCopy.sale : adviceCopy.rent}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {link.label}
              {link.count != null
                ? ` (${link.count.toLocaleString('en-US')})`
                : ''}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
