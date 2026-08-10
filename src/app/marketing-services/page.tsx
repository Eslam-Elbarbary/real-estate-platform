import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { MarketingServicesPage } from '@/features/marketing-services';
import { marketingServicesCopy } from '@/features/marketing-services/config';

export const metadata = createPageMetadata({
  title: marketingServicesCopy.seoTitle,
  description: marketingServicesCopy.seoDescription,
  path: routes.marketingServices,
  image: '/assets/marketing-services/hero.webp',
});

export default function MarketingServicesRoutePage() {
  return <MarketingServicesPage />;
}
