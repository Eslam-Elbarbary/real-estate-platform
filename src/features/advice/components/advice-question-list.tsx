import { AdviceEmptyState } from './advice-empty-state';
import { AdviceQuestionRow } from './advice-question-row';
import type { AdviceQuestion, AdviceQuestionFilters } from '../types';

interface AdviceQuestionListProps {
  questions: AdviceQuestion[];
  filters: AdviceQuestionFilters;
}

export function AdviceQuestionList({ questions, filters }: AdviceQuestionListProps) {
  if (!questions.length) {
    return <AdviceEmptyState filters={filters} />;
  }

  return (
    <div>
      {questions.map((question) => (
        <AdviceQuestionRow key={question.id} question={question} />
      ))}
    </div>
  );
}
