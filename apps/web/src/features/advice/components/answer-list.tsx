import { adviceCopy } from '../config';
import type { AdviceAnswer } from '../types';
import { AnswerCard } from './answer-card';

interface AnswerListProps {
  answers: AdviceAnswer[];
  count: number;
}

export function AnswerList({ answers, count }: AnswerListProps) {
  return (
    <section className="mt-6" aria-labelledby="answers-heading">
      <h2 id="answers-heading" className="text-lg font-extrabold text-ink-950">
        {count > 0 ? adviceCopy.answerCount(count) : adviceCopy.answersHeading}
      </h2>
      {answers.length ? (
        <div className="mt-1">
          {answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-500">لا توجد إجابات بعد. كن أول من يجيب.</p>
      )}
    </section>
  );
}
