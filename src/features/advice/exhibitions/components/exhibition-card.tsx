import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatExhibitionDate } from '../lib/calendar';
import { exhibitionCopy } from '../config';
import type { RealEstateExhibition } from '../types';

interface ExhibitionCardProps {
  exhibition: RealEstateExhibition;
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  const href = routes.advice.exhibitions.details(exhibition.slug);

  return (
    <article className="flex gap-4 border-b border-[#ececec] py-5 sm:gap-5">
      <Link
        href={href}
        className="relative h-[5.5rem] w-[7.5rem] shrink-0 overflow-hidden bg-surface-100 sm:h-[6.5rem] sm:w-[9.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Image
          src={exhibition.coverImage}
          alt={exhibition.title}
          fill
          className="object-cover"
          sizes="152px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-extrabold leading-7 text-ink-950 sm:text-base">
          <Link
            href={href}
            className="hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {exhibition.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-ink-500">
          <time dateTime={exhibition.startDate}>
            {formatExhibitionDate(exhibition.startDate)}
          </time>
          <span aria-hidden> · </span>
          <span>{exhibition.categoryLabel}</span>
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-600">
          {exhibition.shortDescription}
        </p>
        <Link
          href={href}
          className="mt-2.5 inline-flex rounded border border-[#e4e4e4] px-2.5 py-1 text-xs font-semibold text-ink-700 hover:border-brand-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {exhibitionCopy.details}
          <span className="sr-only">: {exhibition.title}</span>
        </Link>
      </div>
    </article>
  );
}
