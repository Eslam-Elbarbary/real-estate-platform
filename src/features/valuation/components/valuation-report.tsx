import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { getPropertyTypeLabel } from '@/config/property-types';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';
import { valuationCopy } from '../config';
import { formatConfidence } from '../lib/format';
import type { ValuationResult } from '../types';
import { ValuationRelatedPropertyCard } from './valuation-related-property-card';

interface ValuationReportProps {
  result: ValuationResult;
  related: Property[];
}

export function ValuationReport({ result, related }: ValuationReportProps) {
  const searchHref = routes.properties.byLocation(
    'sale',
    result.request.propertyType,
    [
      result.request.location.governorateSlug,
      result.request.location.citySlug ?? result.request.location.slug,
    ].filter(Boolean) as string[],
  );

  return (
    <div className="bg-[#faf7f1] pb-16">
      <Container className="py-10">
        <h1 className="text-3xl font-extrabold text-ink-950">
          {valuationCopy.reportTitle}
        </h1>

        <article className="mt-8 rounded-2xl border-2 border-brand-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-lg font-extrabold text-ink-950">
                {result.request.location.name}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {getPropertyTypeLabel(result.request.propertyType)}
              </span>
              <p className="mt-6 text-sm text-ink-500">{valuationCopy.avgMeter}</p>
              <p className="mt-1 text-3xl font-extrabold text-ink-950">
                {formatCurrency(result.averagePricePerSquareMeter)}
              </p>
              <p className="mt-3 text-sm text-ink-600">
                القيمة التقديرية:{' '}
                <span className="font-bold text-ink-900">
                  {formatCurrency(result.estimatedPrice)}
                </span>
              </p>
              {result.priceRange ? (
                <p className="mt-1 text-xs text-ink-500">
                  النطاق:{' '}
                  {formatCurrency(result.priceRange.min)} –{' '}
                  {formatCurrency(result.priceRange.max)}
                </p>
              ) : null}
              <p className="mt-4 text-xs text-ink-400">
                {valuationCopy.demoDisclaimer}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-50 px-5 py-4 text-center lg:min-w-[12rem]">
              <p className="text-sm font-semibold text-ink-600">
                {valuationCopy.confidence}
              </p>
              <p className="mt-2 text-3xl font-extrabold text-brand-700">
                {formatConfidence(result.confidenceScore)}
              </p>
            </div>
          </div>
        </article>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-ink-950">
              {valuationCopy.relatedHeading}
            </h2>
            <Link
              href={searchHref}
              className={getButtonClassName({
                variant: 'outline',
                className: 'h-10',
              })}
            >
              {valuationCopy.discoverMore}
            </Link>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {related.map((property) => (
              <ValuationRelatedPropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
