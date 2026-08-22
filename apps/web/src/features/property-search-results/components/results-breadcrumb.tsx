import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ResultsBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function ResultsBreadcrumb({ items, className }: ResultsBreadcrumbProps) {
  return (
    <nav aria-label="مسار التنقل" className={cn('text-xs text-ink-500', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="inline-flex items-center gap-1.5">
          <Link
            href={routes.home}
            className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"
          >
            <Home className="size-3.5" aria-hidden />
            {siteConfig.name}
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            <ChevronLeft className="size-3.5 text-ink-400" aria-hidden />
            {item.href ? (
              <Link
                href={item.href}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-ink-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
