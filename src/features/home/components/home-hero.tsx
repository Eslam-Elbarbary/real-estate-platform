import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
import { siteConfig } from '@/config/site';
import { getLocationOptions } from '@/features/locations';
import { getHomepageStats } from '@/features/properties';
import { PropertySearchForm } from '@/features/property-search';

export async function HomeHero() {
  const [locations, stats] = await Promise.all([
    getLocationOptions(),
    getHomepageStats(),
  ]);

  return (
    <section className="bg-white pt-4 pb-5 sm:pt-5 sm:pb-6">
      <Container>
        <div className="relative h-[360px] overflow-hidden rounded-[12px] sm:h-[420px] lg:h-[440px] xl:h-[460px]">
          <Image
            src={siteConfig.assets.hero}
            alt="عائلة تنتقل إلى منزلها الجديد"
            fill
            priority
            sizes="(max-width: 768px) 100vw, min(1600px, 100vw)"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-black/20" />

          <div className="absolute inset-0 flex flex-col items-center px-4 pb-5 pt-8 sm:px-8 sm:pb-7 sm:pt-10">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h1 className="text-[1.75rem] font-bold leading-tight text-white drop-shadow-sm sm:text-[1.95rem] lg:text-[2.1rem]">
                {uiLabels.heroTitle}
              </h1>
              <p className="mt-3.5 inline-flex items-center rounded-full bg-black/45 px-5 py-2 text-sm text-white backdrop-blur-sm sm:text-[15px]">
                {uiLabels.heroStatus}
              </p>
            </div>

            <PropertySearchForm
              locations={locations}
              variant="hero"
              className="w-[min(100%,70%)] max-w-none"
              resultCount={stats.totalProperties}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
