'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { siteConfig } from '@/config/site';

export interface BrandingValue {
  siteName: string;
  logoUrl: string | null;
}

const BrandingContext = createContext<BrandingValue>({
  siteName: siteConfig.name,
  logoUrl: null,
});

export function BrandingProvider({
  value,
  children,
}: {
  value: BrandingValue;
  children: ReactNode;
}) {
  return (
    <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
  );
}

export function useBranding(): BrandingValue {
  return useContext(BrandingContext);
}
