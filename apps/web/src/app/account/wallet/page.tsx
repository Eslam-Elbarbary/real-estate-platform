import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { AccountEmptyState, AccountSection } from '@/features/account/components/account-primitives';
import { accountCopy } from '@/features/account/config/account-nav';

export const metadata = createPageMetadata({
  title: accountCopy.walletTitle,
  description: 'محفظتك المالية ومعاملاتك.',
  path: routes.account.wallet,
  noIndex: true,
});

export default function AccountWalletPage() {
  return (
    <AccountSection title={accountCopy.walletTitle}>
      <AccountEmptyState
        icon="accountWallet"
        title={accountCopy.walletEmptyTitle}
        ctaLabel={accountCopy.walletCta}
        ctaHref={routes.packages.root}
      />
    </AccountSection>
  );
}
