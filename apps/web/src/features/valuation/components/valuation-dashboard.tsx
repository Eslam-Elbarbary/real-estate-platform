'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getPropertyTypeLabel } from '@/config/property-types';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import { cn } from '@/lib/utils/cn';
import { valuationCopy } from '../config';
import type {
  PropertyPortfolioItem,
  ValuationDashboardTab,
  ValuationResult,
} from '../types';

interface ValuationDashboardProps {
  valuations: ValuationResult[];
  portfolio: PropertyPortfolioItem[];
  initialTab?: ValuationDashboardTab;
}

export function ValuationDashboard({
  valuations,
  portfolio,
  initialTab = 'valuations',
}: ValuationDashboardProps) {
  const [tab, setTab] = useState<ValuationDashboardTab>(initialTab);

  return (
    <div className="bg-[#faf7f1] pb-16">
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-ink-950">
            {valuationCopy.dashboardTitle}
          </h1>
          <Link
            href={routes.valuation.add}
            className={getButtonClassName({
              className: 'h-11 px-5',
            })}
          >
            {valuationCopy.addNew}
          </Link>
        </div>

        <div
          role="tablist"
          className="mt-8 inline-flex rounded-full border border-border bg-white p-1"
        >
          {(
            [
              ['valuations', valuationCopy.tabValuations],
              ['portfolio', valuationCopy.tabPortfolio],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                tab === value
                  ? 'bg-brand-600 text-white'
                  : 'text-ink-700 hover:bg-surface-50',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-600">
          {tab === 'valuations'
            ? valuationCopy.valuationsHint
            : valuationCopy.portfolioHint}
        </p>

        {tab === 'valuations' ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {valuations.map((item) => (
              <ValuationSummaryCard key={item.id} result={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {portfolio.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function ValuationSummaryCard({ result }: { result: ValuationResult }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-base font-extrabold text-ink-950">
        {result.request.location.name}
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        {getPropertyTypeLabel(result.request.propertyType)}
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">{valuationCopy.avgMeter}</dt>
          <dd className="font-bold text-ink-900">
            {formatCurrency(result.averagePricePerSquareMeter)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">آخر تحديث</dt>
          <dd className="font-semibold text-ink-800">
            {new Intl.DateTimeFormat('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(new Date(result.updatedAt))}
          </dd>
        </div>
      </dl>
      <Link
        href={routes.valuation.report(result.id)}
        className="mt-5 inline-flex text-sm font-bold text-brand-600 hover:underline"
      >
        {valuationCopy.moreDetails}
      </Link>
    </article>
  );
}

function PortfolioCard({ item }: { item: PropertyPortfolioItem }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-base font-extrabold text-ink-950">{item.locationLabel}</h2>
      <p className="mt-1 text-sm text-ink-600">
        {getPropertyTypeLabel(item.propertyType)}
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">{valuationCopy.avgMeter}</dt>
          <dd className="font-bold text-ink-900">
            {formatCurrency(item.averagePricePerSquareMeter)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">القيمة التقديرية</dt>
          <dd className="font-bold text-ink-900">
            {formatCurrency(item.estimatedPrice)}
          </dd>
        </div>
      </dl>
      <Link
        href={routes.valuation.report(item.valuationId)}
        className="mt-5 inline-flex text-sm font-bold text-brand-600 hover:underline"
      >
        {valuationCopy.moreDetails}
      </Link>
    </article>
  );
}
