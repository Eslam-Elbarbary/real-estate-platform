import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { exhibitionCopy } from '../config';
import type { ExhibitionDirectoryView } from '../types';
import { ExhibitionDateSearch } from './exhibition-date-search';
import { ExhibitionEmptyState } from './exhibition-empty-state';
import { ExhibitionsCalendar } from './exhibitions-calendar';
import { ExhibitionsHeader } from './exhibitions-header';

interface ExhibitionsPageProps {
  view: ExhibitionDirectoryView;
}

export function ExhibitionsPage({ view }: ExhibitionsPageProps) {
  const { calendar } = view;

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
          ]}
        />

        <ExhibitionsHeader />

        <ExhibitionDateSearch
          queriedDate={calendar.queriedDate}
          queriedDateHasEvents={calendar.queriedDateHasEvents}
        />

        {calendar.monthEventCount === 0 ? (
          <ExhibitionEmptyState />
        ) : null}

        <ExhibitionsCalendar calendar={calendar} />
      </Container>
    </div>
  );
}
