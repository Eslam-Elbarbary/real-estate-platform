'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { neighborhoodCopy } from '../config';
import type { NeighborhoodPropertyLink } from '../types';
import type { TransactionType } from '@/types';

interface NeighborhoodPropertyLinksProps {
  title: string;
  links: NeighborhoodPropertyLink[];
  transaction: TransactionType;
  basePath: string;
}

export function NeighborhoodPropertyLinks({
  title,
  links,
  transaction,
  basePath,
}: NeighborhoodPropertyLinksProps) {
  const router = useRouter();
  const filtered = links.filter((link) => link.transaction === transaction);
  if (!links.length) return null;

  function setTransaction(next: TransactionType) {
    const url = new URL(basePath, window.location.origin);
    url.searchParams.set('transaction', next);
    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-xl font-extrabold text-ink-950">
          <ChevronLeft className="size-5 text-accent-500" aria-hidden />
          {title}
        </h2>
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
              {value === 'sale' ? neighborhoodCopy.sale : neighborhoodCopy.rent}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {(filtered.length ? filtered : links.filter((l) => l.transaction === 'sale')).map(
          (link) => (
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
          ),
        )}
      </ul>
    </section>
  );
}
