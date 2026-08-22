import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
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
import { getServerSession } from '@/features/auth/session';
import { getSubscriptionService } from '@/features/account/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الصفحة الرئيسية',
  description: siteConfig.description,
  path: '/',
});

async function resolveHomeProCta(): Promise<{ href: string; ctaLabel: string }> {
  const session = await getServerSession();

  if (!session) {
    return {
      href: routes.auth.registerWithReturnTo(routes.pro.root),
      ctaLabel: uiLabels.premiumCta,
    };
  }

  const subscription =
    await getSubscriptionService().getCurrentSubscription();

  if (subscription?.status === 'active') {
    return {
      href: routes.account.subscription,
      ctaLabel: 'إدارة الاشتراك',
    };
  }

  return {
    href: routes.pro.root,
    ctaLabel: uiLabels.premiumCta,
  };
}

async function resolveHomeValuationCta(): Promise<string> {
  const session = await getServerSession();
  if (!session) return routes.valuation.root;
  return routes.valuation.addWithGoal('owned-property');
}

export default async function HomePage() {
  const [proCta, valuationHref] = await Promise.all([
    resolveHomeProCta(),
    resolveHomeValuationCta(),
  ]);

  return (
    <>
      <HomeHero />
      <LatestCompounds />
      <AiValuation href={valuationHref} />
      <KnowSection />
      <PremiumStrip href={proCta.href} ctaLabel={proCta.ctaLabel} />
      <ImportantAreas />
      <AddPropertyCta />
      <AppPromo />
    </>
  );
}
