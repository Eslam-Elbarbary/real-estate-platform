import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import type { NeighborhoodChildSummary } from '../types';

interface NeighborhoodCardProps {
  item: NeighborhoodChildSummary;
  className?: string;
}

export function NeighborhoodCard({ item, className }: NeighborhoodCardProps) {
  const href = routes.neighborhood.details(...item.pathSegments);

  return (
    <Link
      href={href}
      className={cn(
        'group overflow-hidden rounded-md border border-[#e8e8e8] bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
    >
      <div className="border-b border-[#ececec] bg-[#f5f5f5] px-3 py-2.5">
        <h3 className="text-sm font-bold text-ink-900 sm:text-[15px]">{item.nameAr}</h3>
      </div>
      <div className="relative aspect-[16/10] bg-surface-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.nameAr}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </div>
    </Link>
  );
}
