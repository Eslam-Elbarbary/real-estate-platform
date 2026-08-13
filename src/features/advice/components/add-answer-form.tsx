'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { addAdviceAnswerAction } from '../actions';
import { adviceCopy } from '../config';
import {
  createAdviceAnswerSchema,
  type CreateAdviceAnswerValues,
} from '../schemas';

interface AddAnswerFormProps {
  questionId: string;
  questionHref: string;
  isAuthenticated: boolean;
}

export function AddAnswerForm({
  questionId,
  questionHref,
  isAuthenticated,
}: AddAnswerFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateAdviceAnswerValues>({
    resolver: zodResolver(createAdviceAnswerSchema),
    defaultValues: {
      questionId,
      answer: '',
    },
  });

  function onSubmit(values: CreateAdviceAnswerValues) {
    if (!isAuthenticated) {
      router.push(
        routes.auth.loginWithReturnTo(`${questionHref}#answer-form`),
      );
      return;
    }

    setFormError(null);
    startTransition(async () => {
      const result = await addAdviceAnswerAction(values);
      if (result && !result.ok) {
        if (result.fieldErrors?.answer) {
          setError('answer', { message: result.fieldErrors.answer });
        }
        setFormError(result.error);
      }
    });
  }

  return (
    <section
      id="answer-form"
      className="mt-8 scroll-mt-24 border-t border-[#ececec] pt-6"
      aria-labelledby="add-answer-heading"
    >
      <h2 id="add-answer-heading" className="text-lg font-extrabold text-ink-950">
        {adviceCopy.addAnswerTitle}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-3 space-y-3">
        <input type="hidden" {...register('questionId')} />
        <div>
          <label htmlFor="advice-answer" className="sr-only">
            {adviceCopy.addAnswerTitle}
          </label>
          <textarea
            id="advice-answer"
            rows={5}
            placeholder={adviceCopy.addAnswerPlaceholder}
            className={cn(
              'w-full resize-y rounded-md border border-[#d8d8d8] bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              errors.answer && 'border-danger-500',
            )}
            aria-invalid={Boolean(errors.answer)}
            aria-describedby={errors.answer ? 'advice-answer-error' : undefined}
            {...register('answer')}
          />
          {errors.answer ? (
            <p id="advice-answer-error" className="mt-1 text-xs text-danger-600" role="alert">
              {errors.answer.message}
            </p>
          ) : null}
        </div>
        {formError ? (
          <p className="text-xs text-danger-600" role="alert">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className={getButtonClassName({
            className: 'h-11 rounded-md px-6 text-sm font-bold',
          })}
        >
          {adviceCopy.submitAnswer}
        </button>
      </form>
    </section>
  );
}
