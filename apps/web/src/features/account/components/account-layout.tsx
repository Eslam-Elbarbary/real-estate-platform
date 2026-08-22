import type { ReactNode } from 'react';
import { Container } from '@/components/ui/container';
import { accountCopy } from '../config/account-nav';
import { AccountMobileNav, AccountSidebar } from './account-sidebar';

interface AccountLayoutProps {
  children: ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-var(--header-height-lg))] bg-white">
      <Container className="py-8 sm:py-10">
        <h1 className="mb-6 text-2xl font-extrabold text-ink-950 sm:text-3xl">
          {accountCopy.pageTitle}
        </h1>
        <AccountMobileNav />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <AccountSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </Container>
    </div>
  );
}
