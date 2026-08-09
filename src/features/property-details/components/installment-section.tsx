import { uiLabels } from '@/config/labels';
import { formatCurrency } from '@/lib/formatting/currency';
import { cn } from '@/lib/utils/cn';
import type { Property } from '@/types';
import { getPaymentPlan } from '../lib/payment-plan';

interface InstallmentSectionProps {
  property: Property;
}

export function InstallmentSection({ property }: InstallmentSectionProps) {
  const plan = getPaymentPlan(property);
  if (!plan) {
    return null;
  }

  const items = [
    {
      label: uiLabels.installmentPrice,
      value: formatCurrency(plan.totalPrice, plan.currency),
    },
    {
      label: uiLabels.downPaymentLabel,
      value: formatCurrency(plan.downPayment, plan.currency),
    },
    {
      label: uiLabels.installmentDuration,
      value: `${plan.installmentYears} ${uiLabels.yearsUnit}`,
    },
    {
      label: uiLabels.monthlyInstallmentLabel,
      value: formatCurrency(plan.monthlyInstallment, plan.currency),
    },
  ];

  return (
    <section className="pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.installmentSectionTitle}
      </h2>

      <div className="mt-5 grid overflow-hidden rounded-lg border border-border bg-white sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'px-5 py-4',
              index < items.length - 1 && 'border-b border-border lg:border-b-0 lg:border-e',
              index % 2 === 0 && 'sm:border-e lg:border-e',
              index === 1 && 'sm:border-e-0 lg:border-e',
            )}
          >
            <p className="text-sm text-ink-500">{item.label}</p>
            <p className="mt-1.5 text-lg font-extrabold tracking-tight text-ink-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
