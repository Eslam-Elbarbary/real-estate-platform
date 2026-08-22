import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { getCompoundRepository } from '@/data/repositories';
import { formatCompactCurrency } from '@/lib/formatting/currency';

export async function LatestCompounds() {
  const compounds = (await getCompoundRepository().findAll()).slice(0, 5);

  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
            {uiLabels.latestCompounds}
          </h2>
          <Link
            href={routes.compounds.root}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 sm:text-sm"
          >
            {uiLabels.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-[22px]">
          {compounds.map((compound) => (
            <Link
              key={compound.id}
              href={routes.compounds.details(compound.slug)}
              className="group relative block h-[280px] overflow-hidden rounded-2xl sm:h-[300px] lg:h-[320px] xl:h-[330px]"
            >
              <Image
                src={compound.coverImageUrl}
                alt={compound.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              {(compound.isNew || compound.statusLabel) && (
                <span className="absolute top-3 start-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-800">
                  {compound.statusLabel ?? uiLabels.newBadge}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-3.5 text-white sm:p-4">
                <h3 className="truncate text-base font-bold drop-shadow-sm">
                  {compound.name}
                </h3>
                <p className="flex items-center gap-1 truncate text-[13px] text-white/95 drop-shadow-sm">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {compound.areaName}، {compound.cityName}
                </p>
                {compound.minPrice ? (
                  <p className="text-[13px] font-semibold drop-shadow-sm">
                    {uiLabels.startingFrom}{' '}
                    {formatCompactCurrency(compound.minPrice, compound.currency)}
                  </p>
                ) : null}
                <span className="mt-1 inline-flex h-9 w-full items-center justify-center rounded-md bg-black/25 text-xs font-semibold backdrop-blur-[1px] transition-colors group-hover:bg-black/35 sm:text-[13px]">
                  {uiLabels.viewCompound}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
