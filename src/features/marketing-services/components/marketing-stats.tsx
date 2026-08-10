import { Container } from '@/components/ui/container';
import { marketingServicesCopy, marketingStats } from '../config';
import { MarketingLeadForm } from './marketing-lead-form';

export function MarketingLeadStatsSection() {
  return (
    <section className="border-y border-[#eeeeee] bg-[#fafafa] py-10 sm:py-12">
      <Container
        marketing
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12"
      >
        {/* RTL: first column = right (stats), second = left (form) */}
        <div>
          <p className="mb-4 text-xs font-semibold text-ink-500">
            {marketingServicesCopy.demoStatsNote}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {marketingStats.map((stat) => (
              <div key={stat.id} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <p className="text-2xl font-extrabold text-brand-600 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-700">
                    {stat.label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <MarketingLeadForm />
      </Container>
    </section>
  );
}
