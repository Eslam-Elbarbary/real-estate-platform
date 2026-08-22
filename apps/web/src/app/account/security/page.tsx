import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getAccountService } from '@/features/account/service';
import { SecurityPageClient } from '@/features/account/components/security-page-client';
import { accountCopy } from '@/features/account/config/account-nav';

export const metadata = createPageMetadata({
  title: accountCopy.securityTitle,
  description: 'إعدادات الخصوصية والأمان لحسابك.',
  path: routes.account.security,
  noIndex: true,
});

export default async function AccountSecurityPage() {
  const settings = await getAccountService().getSecuritySettings();
  return <SecurityPageClient settings={settings} />;
}
