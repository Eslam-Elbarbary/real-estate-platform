import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatDate } from '@/lib/formatting/date';
import { adviceCopy } from '../config';
import type { AdviceQuestion } from '../types';

interface QuestionHeaderProps {
  question: AdviceQuestion;
}

export function QuestionHeader({ question }: QuestionHeaderProps) {
  const hasDistinctBody =
    Boolean(question.body) && question.body?.trim() !== question.title.trim();

  return (
    <header className="border-b border-[#ececec] pb-5">
      <h1 className="text-xl font-extrabold leading-8 text-ink-950 sm:text-2xl">
        {question.title}
      </h1>
      {hasDistinctBody ? (
        <p className="mt-3 text-sm leading-7 text-ink-700">{question.body}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
        <Link
          href={routes.advice.ask.root}
          className="font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {question.locationLabel}
        </Link>
        <span aria-hidden>·</span>
        <span>{question.categoryLabel}</span>
        <span aria-hidden>·</span>
        <span>{question.author.displayName}</span>
        {question.author.roleLabel ? (
          <>
            <span aria-hidden>·</span>
            <span>{question.author.roleLabel}</span>
          </>
        ) : null}
        {question.author.isVerified ? (
          <span className="text-brand-600">موثّق</span>
        ) : null}
        <span aria-hidden>·</span>
        <time dateTime={question.createdAt}>{formatDate(question.createdAt)}</time>
      </div>
      <p className="mt-3 text-sm font-bold text-accent-600">
        {adviceCopy.answerCount(question.answerCount)}
      </p>
    </header>
  );
}
