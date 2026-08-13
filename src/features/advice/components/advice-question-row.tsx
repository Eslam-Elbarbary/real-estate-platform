import Link from 'next/link';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { adviceCopy } from '../config';
import type { AdviceQuestion } from '../types';

interface AdviceQuestionRowProps {
  question: AdviceQuestion;
}

export function AdviceQuestionRow({ question }: AdviceQuestionRowProps) {
  const href = routes.advice.ask.question(question.id, question.slug);
  const meta = `${question.categoryLabel} في ${question.locationLabel}`;

  return (
    <article className="flex items-start justify-between gap-4 border-b border-[#ececec] py-3.5">
      <div className="min-w-0">
        <Link
          href={href}
          className="block text-[15px] font-bold leading-7 text-ink-950 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {question.title}
        </Link>
        <p className="mt-0.5 text-sm text-brand-600">
          <Link
            href={href}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {meta}
          </Link>
        </p>
      </div>
      <p
        className={cn(
          'shrink-0 pt-0.5 text-sm font-bold',
          question.answerCount > 0 ? 'text-accent-600' : 'text-ink-400',
        )}
      >
        <span className="sr-only">{question.title} — </span>
        {adviceCopy.answerCount(question.answerCount)}
      </p>
    </article>
  );
}
