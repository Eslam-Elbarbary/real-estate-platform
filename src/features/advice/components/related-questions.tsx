import Link from 'next/link';
import { routes } from '@/config/routes';
import type { AdviceQuestion } from '../types';

interface RelatedQuestionsProps {
  questions: AdviceQuestion[];
}

export function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  if (!questions.length) return null;

  return (
    <section className="mt-8">
      <h2 className="text-base font-extrabold text-ink-950">أسئلة ذات صلة</h2>
      <ul className="mt-3 space-y-2">
        {questions.map((question) => (
          <li key={question.id}>
            <Link
              href={routes.advice.ask.question(question.id, question.slug)}
              className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {question.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
