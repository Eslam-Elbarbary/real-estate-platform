import { getLocationOptions } from '@/features/locations';
import { getServerSession } from '@/features/auth/session';
import { AccountMenu } from './account-menu';
import { BrandLogo } from './brand-logo';
import { HeaderBar } from './header-bar';

export async function Header() {
  const [locations, session] = await Promise.all([
    getLocationOptions(),
    getServerSession(),
  ]);

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-border bg-white"
    >
      <HeaderBar
        locations={locations}
        logo={<BrandLogo />}
        accountSlot={<AccountMenu session={session} />}
        session={session}
      />
    </header>
  );
}
