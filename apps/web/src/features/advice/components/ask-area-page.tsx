import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { adviceCopy } from '../config';
import type { AdviceDirectoryView, AdviceQuestionFilters } from '../types';
import { AdviceBreadcrumb, AdviceSectionHeading } from './advice-breadcrumb';
import { AdviceCityLinks } from './advice-city-links';
import { AdviceFilters, type AdviceLocationOption } from './advice-filters';
import { AdvicePagination } from './advice-pagination';
import { AdvicePropertyTeaser } from './advice-property-teaser';
import { AdviceQuestionList } from './advice-question-list';
import { AdviceSuccessBanner } from './advice-success-banner';
import { AdviceTabs } from './advice-tabs';
import { AskQuestionForm } from './ask-question-form';

interface AskAreaPageProps {
  view: AdviceDirectoryView;
  filters: AdviceQuestionFilters;
  locations: AdviceLocationOption[];
  isAuthenticated: boolean;
  created?: boolean;
}

export function AskAreaPage({
  view,
  filters,
  locations,
  isAuthenticated,
  created = false,
}: AskAreaPageProps) {
  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: adviceCopy.breadcrumbHome, href: routes.home },
            { label: adviceCopy.breadcrumbAsk, href: routes.advice.ask.root },
          ]}
        />

        <h1 className="sr-only">{adviceCopy.directoryTitle}</h1>
        {created ? (
          <div className="mt-4">
            <AdviceSuccessBanner message={adviceCopy.questionCreated} />
          </div>
        ) : null}

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19.5rem] lg:items-start">
          <section aria-labelledby="advice-questions-heading">
            <AdviceSectionHeading as="h2">
              <span id="advice-questions-heading">{adviceCopy.directoryHeading}</span>
            </AdviceSectionHeading>
            <AdviceFilters locations={locations} filters={filters} />
            <AdviceTabs filters={filters} />
            <div className="mt-1">
              <AdviceQuestionList
                questions={view.result.items}
                filters={filters}
              />
            </div>
            <AdvicePagination
              filters={filters}
              page={view.result.page}
              totalPages={view.result.totalPages}
            />
          </section>

          <aside className="lg:pt-1">
            <AskQuestionForm
              locations={locations}
              isAuthenticated={isAuthenticated}
            />
            <AdvicePropertyTeaser properties={view.relatedProperties} />
          </aside>
        </div>

        <AdviceCityLinks links={view.cityLinks} filters={filters} />

        <p className="mt-8 text-xs font-semibold text-ink-400">
          {adviceCopy.demoDisclaimer}
        </p>
      </Container>
    </div>
  );
}
