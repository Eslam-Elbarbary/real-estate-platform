'use client';

import { useState, type ReactNode } from 'react';
import { Container } from '@/components/ui/container';
import { DesktopNavigation } from './desktop-navigation';
import { HeaderActions } from './header-actions';
import { HeaderOverlayProvider } from './header-overlay';
import { MobileNavigation } from './mobile-navigation';

interface HeaderBarProps {
  logo: ReactNode;
  accountSlot: ReactNode;
}

export function HeaderBar({ logo, accountSlot }: HeaderBarProps) {
  const [menuRoot, setMenuRoot] = useState<HTMLDivElement | null>(null);

  return (
    <div className="relative">
      <Container className="flex h-header items-center justify-between gap-3 lg:h-header-lg">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          {logo}
          <DesktopNavigation portalRoot={menuRoot} />
        </div>

        <HeaderOverlayProvider>
          <div className="flex items-center gap-1">
            <HeaderActions />
            {accountSlot}
            <MobileNavigation />
          </div>
        </HeaderOverlayProvider>
      </Container>

      <div ref={setMenuRoot} className="absolute inset-x-0 top-full z-50" />
    </div>
  );
}
