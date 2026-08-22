'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type HeaderOverlay = 'none' | 'account' | 'nav';

interface HeaderOverlayContextValue {
  overlay: HeaderOverlay;
  openAccount: () => void;
  openNav: () => void;
  close: () => void;
}

const HeaderOverlayContext = createContext<HeaderOverlayContextValue | null>(
  null,
);

export function HeaderOverlayProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [overlay, setOverlay] = useState<HeaderOverlay>('none');
  const [seenPathname, setSeenPathname] = useState(pathname);

  if (seenPathname !== pathname) {
    setSeenPathname(pathname);
    setOverlay('none');
  }

  const value = useMemo(
    () => ({
      overlay,
      openAccount: () => setOverlay('account'),
      openNav: () => setOverlay('nav'),
      close: () => setOverlay('none'),
    }),
    [overlay],
  );

  return (
    <HeaderOverlayContext.Provider value={value}>
      {children}
    </HeaderOverlayContext.Provider>
  );
}

export function useHeaderOverlay() {
  const context = useContext(HeaderOverlayContext);
  if (!context) {
    throw new Error('useHeaderOverlay must be used within HeaderOverlayProvider');
  }
  return context;
}
