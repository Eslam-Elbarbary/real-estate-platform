import { Tag } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import { valuationCopy } from '../../config';
import type { ValuationResult } from '../../types';
import { ValuationConfidenceCard } from './valuation-confidence-card';
import { ValuationPropertyMeta } from './valuation-property-meta';

interface ValuationReportSummaryProps {
  result: ValuationResult;
}

export function ValuationReportSummary({ result }: ValuationReportSummaryProps) {
  return (
    <article
      className="rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-sm sm:p-7"
      data-testid="owned-report-summary"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-600">
            {valuationCopy.saleEstimateNow}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-3xl font-extrabold text-ink-950 sm:text-4xl">
            <Tag
              size={28}
              strokeWidth={1.75}
              className="text-brand-600"
              aria-hidden
            />
            <span>{formatCurrency(result.estimatedPrice)}</span>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink-600">
              {valuationCopy.rentEstimateNow}
            </p>
            <span className="rounded-md bg-surface-100 px-2.5 py-1 text-xs font-bold text-ink-500">
              {valuationCopy.rentComingSoon}
            </span>
          </div>

          <div className="mt-6 border-t border-[#f0f0f0] pt-5">
            <ValuationPropertyMeta request={result.request} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-44 lg:shrink-0">
          <ValuationConfidenceCard score={result.confidenceScore} compact />
          <Link
            href={routes.addListing}
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            data-testid="report-add-listing"
          >
            {valuationCopy.addListing}
          </Link>
        </div>
      </div>
    </article>
  );
}
