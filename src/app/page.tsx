import { siteConfig } from '@/config/site';
import {
  AddPropertyCta,
  AiValuation,
  AppPromo,
  HomeHero,
  ImportantAreas,
  KnowSection,
  LatestCompounds,
  PremiumStrip,
} from '@/features/home';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الصفحة الرئيسية',
  description: siteConfig.description,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <LatestCompounds />
      <AiValuation />
      <KnowSection />
      <PremiumStrip />
      <ImportantAreas />
      <AddPropertyCta />
      <AppPromo />
    </>
  );
}
