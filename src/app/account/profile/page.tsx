import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getAccountService } from '@/features/account/service';
import { ProfilePageClient } from '@/features/account/components/profile-page-client';
import { accountCopy } from '@/features/account/config/account-nav';

export const metadata = createPageMetadata({
  title: accountCopy.profileTitle,
  description: 'إدارة بيانات حسابك على منصة العقارات.',
  path: routes.account.profile,
  noIndex: true,
});

export default async function AccountProfilePage() {
  const profile = await getAccountService().getProfile();
  return <ProfilePageClient profile={profile} />;
}
