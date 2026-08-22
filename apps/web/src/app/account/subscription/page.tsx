import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import {
  AccountEmptyState,
  AccountSection,
} from '@/features/account/components/account-primitives';
import { accountCopy } from '@/features/account/config/account-nav';
import { getSubscriptionService } from '@/features/account/service';
import { ActiveSubscriptionPanel } from '@/features/subscriptions/components/active-subscription-panel';

export const metadata = createPageMetadata({
  title: accountCopy.subscriptionTitle,
  description: 'خطة الاشتراك الخاصة بحسابك.',
  path: routes.account.subscription,
  noIndex: true,
});

export default async function AccountSubscriptionPage() {
  const subscription = await getSubscriptionService().getCurrentSubscription();

  return (
    <AccountSection title={accountCopy.subscriptionTitle}>
      {!subscription ? (
        <AccountEmptyState
          icon="accountSubscription"
          title={accountCopy.subscriptionEmptyTitle}
          ctaLabel={accountCopy.subscriptionCta}
          ctaHref={routes.pro.root}
        />
      ) : (
        <ActiveSubscriptionPanel subscription={subscription} />
      )}
    </AccountSection>
  );
}
