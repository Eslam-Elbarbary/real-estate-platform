import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import type { TransactionType } from '@/types';

interface EmptyStateProps {
  transactionType?: TransactionType;
}

export function EmptyState({ transactionType = 'sale' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white px-6 py-14 text-center">
      <SearchX className="size-10 text-ink-400" aria-hidden />
      <h2 className="mt-4 text-lg font-bold text-ink-900">
        {uiLabels.emptyResultsTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-600">
        {uiLabels.emptyResultsDescription}
      </p>
      <Link
        href={routes.properties.root(transactionType)}
        className={getButtonClassName({ className: 'mt-5' })}
      >
        {uiLabels.emptyResultsReset}
      </Link>
    </div>
  );
}
