import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { AccountLayout } from '@/features/account/components/account-layout';

export default async function AccountRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    const headerList = await headers();
    const pathname = headerList.get('x-pathname') ?? routes.account.profile;
    const returnTo =
      pathname === routes.account.root ? routes.account.profile : pathname;
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  return <AccountLayout>{children}</AccountLayout>;
}
