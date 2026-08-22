import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { adviceCopy } from '../config';
import type { AdviceQuestionDetailsView, AdviceQuestionFilters } from '../types';
import { AddAnswerForm } from './add-answer-form';
import { AdviceBreadcrumb } from './advice-breadcrumb';
import { AdviceCityLinks } from './advice-city-links';
import { AdvicePropertyTeaser } from './advice-property-teaser';
import { AdviceSuccessBanner } from './advice-success-banner';
import { AnswerList } from './answer-list';
import { QuestionHeader } from './question-header';
import { RelatedQuestions } from './related-questions';

interface QuestionDetailsPageProps {
  view: AdviceQuestionDetailsView;
  filters: AdviceQuestionFilters;
  isAuthenticated: boolean;
  created?: boolean;
  answered?: boolean;
}

export function AdviceQuestionDetailsPage({
  view,
  filters,
  isAuthenticated,
  created = false,
  answered = false,
}: QuestionDetailsPageProps) {
  const href = routes.advice.ask.question(view.question.id, view.question.slug);

  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: adviceCopy.breadcrumbHome, href: routes.home },
            { label: adviceCopy.breadcrumbAsk, href: routes.advice.ask.root },
            { label: view.question.title, href },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19.5rem] lg:items-start">
          <div>
            {created ? (
              <AdviceSuccessBanner message={adviceCopy.questionCreated} />
            ) : null}
            {answered ? (
              <AdviceSuccessBanner message={adviceCopy.answerCreated} />
            ) : null}
            <QuestionHeader question={view.question} />
            <AnswerList answers={view.answers} count={view.question.answerCount} />
            <AddAnswerForm
              questionId={view.question.id}
              questionHref={href}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <aside>
            <AdvicePropertyTeaser properties={view.relatedProperties} />
            <RelatedQuestions questions={view.relatedQuestions} />
          </aside>
        </div>

        <AdviceCityLinks links={view.cityLinks} filters={filters} pathname={href} />

        <p className="mt-8 text-xs font-semibold text-ink-400">
          {adviceCopy.demoDisclaimer}
        </p>
      </Container>
    </div>
  );
}
