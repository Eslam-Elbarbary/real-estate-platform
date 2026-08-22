import { formatDate } from '@/lib/formatting/date';
import type { AdviceAnswer } from '../types';

interface AnswerCardProps {
  answer: AdviceAnswer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <article className="border-b border-[#ececec] py-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <p className="font-bold text-ink-950">{answer.author.displayName}</p>
        {answer.author.roleLabel ? (
          <span className="text-ink-500">{answer.author.roleLabel}</span>
        ) : null}
        {answer.author.isVerified ? (
          <span className="text-xs font-semibold text-brand-600">موثّق</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-7 text-ink-800">{answer.body}</p>
      <time
        className="mt-2 block text-xs text-ink-400"
        dateTime={answer.createdAt}
      >
        {formatDate(answer.createdAt)}
      </time>
    </article>
  );
}
