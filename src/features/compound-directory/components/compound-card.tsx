import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin } from 'lucide-react';
import { ContactActionFooter } from '@/components/ui/contact-action-footer';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Compound } from '@/types';
import { cn } from '@/lib/utils/cn';

interface CompoundCardProps {
  compound: Compound;
  className?: string;
}

export function CompoundCard({ compound, className }: CompoundCardProps) {
  const href = routes.compounds.details(compound.slug);
  const cover =
    compound.images.find((image) => image.isCover)?.url ?? compound.coverImageUrl;
  const title = compound.nameEn
    ? `${compound.nameEn} - ${compound.nameAr}`
    : compound.nameAr || compound.name;
  const locationLabel = [compound.areaName, compound.cityName]
    .filter(Boolean)
    .join(' - ');
  const starting =
    compound.startingPrice ?? compound.minPrice ?? undefined;
  const logoIsSvg = compound.developerLogo?.endsWith('.svg');

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      <div className="relative aspect-[3/2] min-h-[260px] overflow-hidden bg-surface-100 sm:min-h-[270px]">
        <Link href={href} className="absolute inset-0" tabIndex={-1}>
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </Link>
        {compound.verified ? (
          <span className="absolute top-3 end-3 z-10 rounded border border-success-700/20 bg-white px-2 py-0.5 text-[11px] font-semibold text-success-700 shadow-sm">
            {uiLabels.verifiedBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 py-3">
        <Link
          href={href}
          className="line-clamp-2 text-[15px] font-bold leading-6 text-ink-900 hover:text-brand-700"
        >
          {title}
        </Link>

        <p className="flex items-center gap-1.5 text-[12px] leading-5 text-ink-500">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{locationLabel}</span>
        </p>

        {starting !== undefined ? (
          <p className="mt-0.5 text-[14px] font-semibold leading-6 text-ink-950">
            <span className="me-1 font-medium text-ink-600">
              {uiLabels.compoundsStartsFrom}
            </span>
            {formatCurrency(starting, compound.currency)}
          </p>
        ) : null}

        <div className="mt-2 flex items-center gap-3 border-t border-border pt-2.5">
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-50 text-brand-700">
            {compound.developerLogo ? (
              <Image
                src={compound.developerLogo}
                alt={compound.developerName}
                width={44}
                height={44}
                unoptimized={logoIsSvg}
                className="size-full object-cover"
              />
            ) : (
              <Building2 className="size-5" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink-700">
              {compound.developerName}
            </p>
            {compound.developerProjectCount !== undefined ? (
              <p className="text-[11px] leading-4 text-ink-500">
                {compound.developerProjectCount} {uiLabels.compoundsProjectsCount}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <ContactActionFooter
        phone={compound.phone}
        whatsapp={compound.whatsapp}
        message={`مرحبا، أنا مهتم بمشروع ${compound.nameAr || compound.name}`}
        callLabel={uiLabels.compoundsCallShort}
      />
    </article>
  );
}
