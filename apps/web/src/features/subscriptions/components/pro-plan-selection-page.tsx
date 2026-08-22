import { SubscriptionPlanCard } from './subscription-plan-card';
import {
  subscriptionCopy,
  subscriptionPlans,
} from '../config';

export function ProPlanSelectionPage() {
  return (
    <div className="bg-[#f4f6f8]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-extrabold text-ink-950 sm:text-3xl lg:text-4xl">
            {subscriptionCopy.planPageTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-600 sm:text-base">
            {subscriptionCopy.planPageSubtitle}
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-stretch md:gap-8">
          {subscriptionPlans.map((plan) => (
            <SubscriptionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
