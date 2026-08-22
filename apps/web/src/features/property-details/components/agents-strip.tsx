import { uiLabels } from '@/config/labels';
import { HorizontalCardsCarousel } from '@/components/ui/horizontal-cards-carousel';
import { recommendedAgents } from '../data/recommended-agents';

export function AgentsStrip() {
  return (
    <section className="pt-10 pb-2">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.agentsStripTitle}
      </h2>

      <div className="mt-5">
        <HorizontalCardsCarousel
          ariaLabel={uiLabels.agentsStripTitle}
          slideClassName="basis-[72%] pe-3 sm:basis-[40%] md:basis-[28%] lg:basis-[20%] xl:basis-[16.5%]"
        >
          {recommendedAgents.map((agent) => (
            <article
              key={agent.id}
              className="flex h-[84px] items-center gap-3 rounded-xl border border-border bg-white px-3.5"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                {agent.initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900">
                  {agent.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-600">{agent.meta}</p>
              </div>
            </article>
          ))}
        </HorizontalCardsCarousel>
      </div>
    </section>
  );
}
