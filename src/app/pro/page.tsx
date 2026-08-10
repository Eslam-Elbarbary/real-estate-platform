import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ProPlanSelectionPage } from '@/features/subscriptions/components/pro-plan-selection-page';
import { subscriptionCopy } from '@/features/subscriptions/config';

export const metadata = createPageMetadata({
  title: subscriptionCopy.seoTitle,
  description: subscriptionCopy.seoDescription,
  path: routes.pro.root,
});

export default function ProPage() {
  return <ProPlanSelectionPage />;
}
