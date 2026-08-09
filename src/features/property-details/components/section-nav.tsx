'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  propertySectionNav,
  type PropertySectionId,
} from '../lib/section-nav';

export function PropertySectionNav() {
  const [active, setActive] = useState<PropertySectionId>('photos');

  useEffect(() => {
    const syncActive = () => {
      const stickyOffset =
        document.querySelector<HTMLElement>('[aria-label="أقسام صفحة العقار"]')
          ?.getBoundingClientRect().bottom ?? 160;

      let current: PropertySectionId = 'photos';

      for (const item of propertySectionNav) {
        const element = document.getElementById(item.id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= stickyOffset + 8) {
          current = item.id;
        }
      }

      setActive((previous) => (previous === current ? previous : current));
    };

    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    document.addEventListener('scroll', syncActive, { passive: true, capture: true });
    window.addEventListener('resize', syncActive);

    return () => {
      window.removeEventListener('scroll', syncActive);
      document.removeEventListener('scroll', syncActive, true);
      window.removeEventListener('resize', syncActive);
    };
  }, []);

  return (
    <nav
      aria-label="أقسام صفحة العقار"
      className="sticky top-[var(--header-height-lg)] z-20 mt-5 border-b border-border bg-white/95 backdrop-blur-sm"
    >
      <ul className="flex gap-0.5 overflow-x-auto">
        {propertySectionNav.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                className={cn(
                  'inline-flex h-11 items-center px-3.5 text-[13px] font-semibold transition-colors sm:text-sm',
                  isActive
                    ? 'border-b-[3px] border-brand-600 text-brand-700'
                    : 'border-b-[3px] border-transparent text-ink-600 hover:text-ink-900',
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
