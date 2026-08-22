import { Check } from 'lucide-react';
import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import type { SubscriptionPlan } from '@/features/account/types';
import { cn } from '@/lib/utils/cn';
import {
  resolvePlanPricing,
  subscriptionCopy,
} from '../config';
import { buildProCheckoutHref } from '../search-params';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
}

function formatPlanPrice(amount: number): string {
  return `${amount.toLocaleString('en-US')} جنيه`;
}

export function SubscriptionPlanCard({ plan }: SubscriptionPlanCardProps) {
  const billing = plan.billingPeriod ?? 'monthly';
  const pricing = resolvePlanPricing(plan, billing);
  const checkoutHref = buildProCheckoutHref({
    plan: plan.id,
    billing,
  });
  const highlighted = Boolean(plan.highlighted);

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm',
        highlighted ? 'border-2 border-accent-500' : 'border-[#e5e5e5]',
      )}
      data-testid={`pro-plan-${plan.id}`}
    >
      {plan.badge ? (
        <span className="absolute start-4 top-0 z-10 rounded-b-md bg-accent-500 px-2.5 py-1 text-xs font-extrabold text-white">
          {plan.badge}
        </span>
      ) : null}

      <div
        className={cn(
          'border-b border-[#ececec] px-6 pb-5 pt-8 sm:px-7',
          highlighted ? 'bg-[#fffaf5]' : 'bg-[#f7f7f7]',
        )}
      >
        <h2
          className={cn(
            'text-lg font-extrabold sm:text-xl',
            highlighted ? 'text-[#b8860b]' : 'text-ink-950',
          )}
        >
          {pricing.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <p className="text-2xl font-extrabold text-ink-950 sm:text-3xl">
            {formatPlanPrice(pricing.priceEgp)}{' '}
            <span className="text-base font-bold text-ink-700">
              {pricing.periodLabel}
            </span>
          </p>
          {pricing.originalPriceEgp != null ? (
            <p className="text-sm text-ink-400 line-through">
              {formatPlanPrice(pricing.originalPriceEgp)}
            </p>
          ) : null}
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-3 px-6 py-5 sm:px-7">
        {plan.features.map((feature) => (
          <li
            key={feature.id}
            className="flex items-start gap-2 text-sm leading-6 text-ink-800"
          >
            <span
              className={cn(
                'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full',
                feature.id === 'points'
                  ? 'bg-success-50 text-success-700'
                  : 'bg-brand-50 text-brand-700',
              )}
              aria-hidden
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <span>
              {feature.label}
              {typeof feature.value === 'string' ? (
                <span className="font-semibold"> : {feature.value}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      {plan.listingExclusionWarning ? (
        <div
          className="mx-6 mb-4 rounded-md bg-[#fde8e8] px-3 py-2 text-sm font-semibold text-danger-700 sm:mx-7"
          role="note"
        >
          {plan.listingExclusionWarning}
        </div>
      ) : null}

      <div className="px-6 pb-6 sm:px-7">
        <Link
          href={checkoutHref}
          className={getButtonClassName({
            className: 'h-11 w-full rounded-lg font-bold',
          })}
          data-testid={`pro-subscribe-${plan.id}`}
        >
          {subscriptionCopy.subscribeCta}
        </Link>
      </div>
    </article>
  );
}
