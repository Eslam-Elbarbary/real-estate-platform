import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import { neighborhoodCopy } from '../config';
import type { NeighborhoodBroker } from '../types';

interface NeighborhoodBrokersProps {
  name: string;
  brokers: NeighborhoodBroker[];
}

export function NeighborhoodBrokers({ name, brokers }: NeighborhoodBrokersProps) {
  if (!brokers.length) return null;

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950">
        {neighborhoodCopy.brokersPrefix} {name}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brokers.map((broker) => (
          <article
            key={broker.id}
            className="flex items-center gap-3 rounded-lg border border-[#e8e8e8] bg-white p-4 shadow-sm"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-[#eee] bg-surface-50">
              {broker.logo ? (
                <Image
                  src={broker.logo}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes="56px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-sm font-extrabold text-ink-950">
                  {broker.name}
                </h3>
                {broker.verified ? (
                  <BadgeCheck
                    className="size-4 shrink-0 text-brand-600"
                    aria-label="موثّق"
                  />
                ) : null}
              </div>
              {broker.listingCount != null ? (
                <p className="mt-1 text-xs font-semibold text-ink-500">
                  {neighborhoodCopy.listingCount(broker.listingCount)}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
