import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
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
        <div className="relative h-[420px] overflow-hidden rounded-[12px] min-[430px]:h-[440px] sm:h-[420px] lg:h-[440px] xl:h-[460px]">
          <Image
            src="/assets/home/hero/hero.png"
            alt="ابحث عن بيت أحلامك"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/22 to-black/14 sm:from-black/55 sm:via-black/30 sm:to-black/20" />

          <div className="absolute inset-0 flex flex-col items-center px-0 pb-6 pt-9 sm:px-8 sm:pb-7 sm:pt-10">
            <div className="flex w-[90%] max-w-[22rem] flex-col items-center text-center sm:w-full sm:max-w-none sm:flex-1 sm:justify-center">
              <h1 className="max-w-[90%] text-[1.7rem] font-bold leading-[1.25] text-white drop-shadow-sm sm:max-w-none sm:text-[1.95rem] lg:text-[2.1rem]">
                {uiLabels.heroTitle}
              </h1>
              <p className="mt-3 inline-flex h-9 items-center rounded-full bg-black/45 px-4 text-sm leading-none text-white backdrop-blur-sm sm:mt-3.5 sm:h-auto sm:px-5 sm:py-2 sm:text-[15px] sm:leading-normal">
                {uiLabels.heroStatus}
              </p>
            </div>

            <PropertySearchForm
              locations={locations}
              variant="hero"
              className="mt-5 w-[calc(100%-24px)] max-w-[390px] sm:mt-0 sm:w-[min(100%,70%)] sm:max-w-none"
              resultCount={stats.totalProperties}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
