import { uiLabels } from '@/config/labels';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';
import { getPaymentPlan } from '../lib/payment-plan';
import { ContactActions } from './contact-actions';

interface PropertySummaryProps {
  property: Property;
}

export function PropertySummary({ property }: PropertySummaryProps) {
  const paymentPlan = getPaymentPlan(property);

  return (
    <section className="flex flex-col gap-3 pb-2 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-[2.25rem] font-extrabold leading-none tracking-tight text-ink-950 sm:text-[2.65rem]">
            {formatCurrency(
              property.price,
              property.currency,
              property.pricingPeriod,
            )}
          </p>
          {paymentPlan ? (
            <span className="inline-flex items-center rounded-md bg-accent-500 px-2.5 py-1 text-xs font-bold text-ink-950">
              {uiLabels.financingBadge}
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 max-w-4xl text-[1.3rem] font-bold leading-9 text-ink-900 sm:text-[1.55rem] sm:leading-10">
          {property.title}
        </h1>
      </div>

      <ContactActions
        seller={property.seller}
        message={`مرحبا، أنا مهتم بـ ${property.title}`}
        size="lg"
        className="shrink-0"
      />
    </section>
  );
}
