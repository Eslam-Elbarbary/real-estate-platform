import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { exhibitionCopy } from '../config';
import type { ExhibitionDetailsView } from '../types';
import { ExhibitionContent } from './exhibition-content';
import { ExhibitionMeta } from './exhibition-meta';
import { ExhibitionPoster } from './exhibition-poster';
import { ExhibitionShareActions } from './exhibition-share-actions';
import { RelatedExhibitions } from './related-exhibitions';

interface ExhibitionDetailsPageProps {
  view: ExhibitionDetailsView;
}

export function ExhibitionDetailsPage({ view }: ExhibitionDetailsPageProps) {
  const { exhibition, related } = view;
  const href = routes.advice.exhibitions.details(exhibition.slug);

  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: exhibitionCopy.breadcrumbHome, href: routes.home },
            { label: exhibitionCopy.breadcrumbKnow, href: routes.advice.root },
            {
              label: exhibitionCopy.breadcrumbExhibitions,
              href: routes.advice.exhibitions.root,
            },
            { label: exhibition.title, href },
          ]}
        />

        <article className="mx-auto mt-6 max-w-3xl">
          <h1 className="text-2xl font-extrabold leading-snug text-brand-700 sm:text-[1.85rem]">
            {exhibition.title}
          </h1>
          <ExhibitionMeta exhibition={exhibition} />
          <ExhibitionContent exhibition={exhibition} />
          {exhibition.posterImage ? (
            <ExhibitionPoster
              src={exhibition.posterImage}
              title={exhibition.title}
            />
          ) : null}
          <ExhibitionShareActions title={exhibition.title} path={href} />
        </article>

        <RelatedExhibitions exhibitions={related} />

        <p className="mt-10">
          <Link
            href={routes.advice.exhibitions.root}
            className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {exhibitionCopy.backToDirectory}
          </Link>
        </p>
      </Container>
    </div>
  );
}
