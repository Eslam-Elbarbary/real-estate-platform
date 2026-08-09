import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import type { Developer } from '@/types';
import { cn } from '@/lib/utils/cn';

interface CompoundDeveloperSectionProps {
  developer: Developer;
  className?: string;
}

export function CompoundDeveloperSection({
  developer,
  className,
}: CompoundDeveloperSectionProps) {
  const logoIsSvg = developer.logoUrl?.endsWith('.svg');

  return (
    <section className={cn(className)}>
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        {uiLabels.compoundDetailsDeveloperTitle}
      </h2>

      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-50">
            {developer.logoUrl ? (
              <Image
                src={developer.logoUrl}
                alt={developer.name}
                width={56}
                height={56}
                unoptimized={logoIsSvg}
                className="size-full object-cover"
              />
            ) : (
              <Building2 className="size-6 text-brand-700" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-ink-900">
              {developer.name}
            </p>
            {developer.memberSinceYear ? (
              <p className="mt-0.5 text-[12px] text-ink-500">
                {uiLabels.compoundDetailsDeveloperMemberSince}{' '}
                {developer.memberSinceYear}
              </p>
            ) : null}
            {developer.description ? (
              <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-ink-600">
                {developer.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[12px] text-ink-600 sm:justify-end">
          {developer.unitsForSale !== undefined ? (
            <span>
              <strong className="text-ink-900">{developer.unitsForSale}</strong>{' '}
              {uiLabels.compoundDetailsDeveloperForSale}
            </span>
          ) : null}
          {developer.unitsForRent !== undefined ? (
            <span>
              <strong className="text-ink-900">{developer.unitsForRent}</strong>{' '}
              {uiLabels.compoundDetailsDeveloperForRent}
            </span>
          ) : null}
          {developer.projectsCount !== undefined ? (
            <span>
              <strong className="text-ink-900">{developer.projectsCount}</strong>{' '}
              {uiLabels.compoundDetailsDeveloperProjects}
            </span>
          ) : null}
          <Link
            href={routes.developer(developer.slug)}
            className="font-semibold text-brand-700 hover:text-brand-600"
          >
            {uiLabels.compoundDetailsDeveloperView}
          </Link>
        </div>
      </div>
    </section>
  );
}
