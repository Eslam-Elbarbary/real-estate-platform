import { getServerSession } from '@/features/auth/session';
import type { PublicPlatformSettings } from '@/features/settings';
import { resolveSiteName } from '@/features/settings';
import { AccountMenu } from './account-menu';
import { BrandLogo } from './brand-logo';
import { HeaderBar } from './header-bar';

interface HeaderProps {
  settings: PublicPlatformSettings;
}

export async function Header({ settings }: HeaderProps) {
  const session = await getServerSession();
  const siteName = resolveSiteName(settings);

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-border bg-white"
    >
      <HeaderBar
        logo={
          <BrandLogo siteName={siteName} logoUrl={settings.logoUrl} />
        }
        accountSlot={<AccountMenu session={session} />}
      />
    </header>
  );
}
