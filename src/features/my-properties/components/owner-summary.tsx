import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { myPropertiesCopy } from '../config/copy';

interface ListingOwnerSummaryProps {
  name: string;
}

export function ListingOwnerSummary({ name }: ListingOwnerSummaryProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#e5e5e5] bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <div>
        <h2 className="text-lg font-extrabold text-ink-950">{name}</h2>
        <p className="mt-1 text-sm text-ink-500">{myPropertiesCopy.noRatingsYet}</p>
      </div>
      <Link
        href={routes.valuation.root}
        className={getButtonClassName({
          className: 'h-10 rounded-lg px-5 font-bold',
        })}
      >
        {myPropertiesCopy.showRating}
      </Link>
    </div>
  );
}
