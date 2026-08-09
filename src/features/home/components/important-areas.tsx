import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { HorizontalCardsCarousel } from '@/components/ui/horizontal-cards-carousel';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { getFeaturedAreas } from '@/features/locations';

export async function ImportantAreas() {
  const locations = await getFeaturedAreas();

  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <h2 className="mb-4 text-lg font-bold text-ink-900 sm:text-xl">
          {uiLabels.importantAreas}
        </h2>

        <HorizontalCardsCarousel ariaLabel={uiLabels.importantAreas}>
          {locations.map((location) => {
            const href =
              location.level === 'governorate'
                ? routes.properties.byLocation('sale', 'apartment', [
                    location.slug,
                  ])
                : location.parentSlug
                  ? routes.properties.byLocation('sale', 'apartment', [
                      location.parentSlug,
                      location.slug,
                    ])
                  : routes.properties.root('sale');

            return (
              <Link
                key={location.id}
                href={href}
                className="group relative block h-[300px] w-full overflow-hidden rounded-[15px] sm:h-[320px] lg:h-[330px] xl:h-[340px]"
              >
                <Image
                  src={location.coverImageUrl!}
                  alt={location.name}
                  fill
                  sizes="(max-width: 768px) 70vw, 310px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex justify-center p-3.5">
                  <p className="inline-flex max-w-[90%] items-center gap-1.5 rounded-lg bg-black/45 px-3.5 py-2 text-sm font-bold text-white backdrop-blur-[2px]">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{location.name}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </HorizontalCardsCarousel>
      </Container>
    </section>
  );
}
