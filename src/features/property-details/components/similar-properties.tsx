import { uiLabels } from '@/config/labels';
import { HorizontalCardsCarousel } from '@/components/ui/horizontal-cards-carousel';
import { PropertyCard } from '@/features/property-search-results/components/property-card';
import type { Property } from '@/types';

interface SimilarPropertiesProps {
  properties: Property[];
}

export function SimilarProperties({ properties }: SimilarPropertiesProps) {
  if (!properties.length) {
    return null;
  }

  return (
    <section className="pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.similarListingsTitle}
      </h2>

      <div className="mt-5">
        <HorizontalCardsCarousel
          ariaLabel={uiLabels.similarListingsTitle}
          slideClassName="basis-[85%] pe-4 sm:basis-[46%] md:basis-[32%] lg:basis-[24%] xl:basis-[20%] 2xl:basis-[19.5%]"
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </HorizontalCardsCarousel>
      </div>
    </section>
  );
}
