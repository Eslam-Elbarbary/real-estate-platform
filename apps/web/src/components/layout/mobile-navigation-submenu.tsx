import Link from 'next/link';
import type { MobileDrawerLink } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';

interface MobileNavigationSubmenuProps {
  id: string;
  links: MobileDrawerLink[];
  onNavigate: () => void;
}

export function MobileNavigationSubmenu({
  id,
  links,
  onNavigate,
}: MobileNavigationSubmenuProps) {
  return (
    <ul id={id} className="border-b border-surface-100 bg-white pb-1">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link
            href={link.href}
            className={cn(
              'flex min-h-10 items-center px-5 py-2 text-end text-[0.9375rem] leading-snug text-ink-800',
              'hover:bg-surface-50 hover:text-brand-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
              link.strong && 'font-semibold text-ink-950',
            )}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
