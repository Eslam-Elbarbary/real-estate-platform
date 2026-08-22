import { Building2, Star } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { Property } from '@/types';
import { getSellerTypeLabel } from '../lib/labels';
import { ContactActions } from './contact-actions';

interface SellerSectionProps {
  property: Property;
}

export function SellerSection({ property }: SellerSectionProps) {
  const { seller } = property;

  return (
    <section className="pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.sellerSectionTitle}
      </h2>

      <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-brand-700">
            <Building2 className="size-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-ink-900">
              {seller.name}
            </p>
            <p className="mt-0.5 text-sm text-ink-600">
              {getSellerTypeLabel(seller.type)}
              {seller.isVerified ? ` · ${uiLabels.verifiedBadge}` : null}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-700">
              {seller.rating !== undefined ? (
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Star
                    className="size-3.5 fill-accent-500 text-accent-500"
                    aria-hidden
                  />
                  {seller.rating.toFixed(1)}
                </span>
              ) : null}
              {seller.listingCount !== undefined ? (
                <span>
                  {seller.listingCount} {uiLabels.sellerListings}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <ContactActions
          seller={seller}
          message={`مرحبا، أنا مهتم بـ ${property.title}`}
          className="shrink-0"
        />
      </div>
    </section>
  );
}
