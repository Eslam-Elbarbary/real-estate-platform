import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
import { getSearchLocationOptions } from '@/features/locations/api-options';
import { getHomepageStats } from '@/features/properties';
import { fetchPropertyTypes } from '@/features/properties/api/catalogs';
import { toCatalogPropertyTypeOptions } from '@/features/properties/lib/property-type-options';
import { PropertySearchForm } from '@/features/property-search';
import { getPublicBanners } from '@/features/banners';
import { HeroBannerSlider } from '@/features/banners/components/hero-banner-slider';

export async function HomeHero() {
  const [locations, stats, propertyTypes, heroBanners] = await Promise.all([
    getSearchLocationOptions().catch(() => []),
    getHomepageStats().catch(() => ({
      totalProperties: 0,
      saleCount: 0,
      rentCount: 0,
    })),
    fetchPropertyTypes().catch(() => []),
    getPublicBanners('HOME_HERO'),
  ]);
  const propertyTypeOptions = toCatalogPropertyTypeOptions(propertyTypes);

  return (
    <section className="bg-white pt-4 pb-5 sm:pt-5 sm:pb-6">
      <Container>
        <HeroBannerSlider
          banners={heroBanners}
          fallback={{
            title: uiLabels.heroTitle,
            description: uiLabels.heroStatus,
            desktopImage: '/assets/home/hero/hero.png',
            mobileImage: '/assets/home/hero/hero.png',
          }}
        >
          <PropertySearchForm
            locations={locations}
            propertyTypeOptions={propertyTypeOptions}
            variant="hero"
            className="mt-5 w-[calc(100%-24px)] max-w-[390px] sm:mt-0 sm:w-[min(100%,70%)] sm:max-w-none"
            resultCount={stats.totalProperties}
          />
        </HeroBannerSlider>
      </Container>
    </section>
  );
}
