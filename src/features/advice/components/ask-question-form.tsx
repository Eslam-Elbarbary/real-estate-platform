'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { createAdviceQuestionAction } from '../actions';
import { adviceCategories, adviceCopy } from '../config';
import {
  createAdviceQuestionSchema,
  type CreateAdviceQuestionValues,
} from '../schemas';
import { AdviceSectionHeading } from './advice-breadcrumb';
import type { AdviceLocationOption } from './advice-filters';

interface AskQuestionFormProps {
  locations: AdviceLocationOption[];
  isAuthenticated: boolean;
}

const fieldClass =
  'h-10 w-full rounded-md border border-[#d8d8d8] bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200';

export function AskQuestionForm({
  locations,
  isAuthenticated,
}: AskQuestionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateAdviceQuestionValues>({
    resolver: zodResolver(createAdviceQuestionSchema),
    defaultValues: {
      locationId: '',
      categoryId: '',
      question: '',
    },
  });

  function onSubmit(values: CreateAdviceQuestionValues) {
    if (!isAuthenticated) {
      router.push(
        routes.auth.loginWithReturnTo(`${routes.advice.ask.root}#ask-form`),
      );
      return;
    }

    setFormError(null);
    startTransition(async () => {
      const result = await createAdviceQuestionAction(values);
      if (result && !result.ok) {
        if (result.fieldErrors) {
          for (const [key, message] of Object.entries(result.fieldErrors)) {
            setError(key as keyof CreateAdviceQuestionValues, { message });
          }
        }
        setFormError(result.error);
      }
    });
  }

  return (
    <section
      id="ask-form"
      className="scroll-mt-24"
      aria-labelledby="ask-form-heading"
    >
      <AdviceSectionHeading as="h2" className="text-lg">
        <span id="ask-form-heading">{adviceCopy.directoryTitle}</span>
      </AdviceSectionHeading>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        {adviceCopy.directoryIntro}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-4 space-y-2.5"
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="ask-location" className="sr-only">
              {adviceCopy.locationPlaceholder}
            </label>
            <select
              id="ask-location"
              className={cn(fieldClass, errors.locationId && 'border-danger-500')}
              aria-invalid={Boolean(errors.locationId)}
              aria-describedby={errors.locationId ? 'ask-location-error' : undefined}
              {...register('locationId')}
            >
              <option value="" disabled>
                {adviceCopy.locationPlaceholder}
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.locationId ? (
              <p id="ask-location-error" className="mt-1 text-xs text-danger-600" role="alert">
                {errors.locationId.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ask-category" className="sr-only">
              {adviceCopy.categorySelectPlaceholder}
            </label>
            <select
              id="ask-category"
              className={cn(fieldClass, errors.categoryId && 'border-danger-500')}
              aria-invalid={Boolean(errors.categoryId)}
              aria-describedby={errors.categoryId ? 'ask-category-error' : undefined}
              {...register('categoryId')}
            >
              <option value="" disabled>
                {adviceCopy.categorySelectPlaceholder}
              </option>
              {adviceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameAr}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p id="ask-category-error" className="mt-1 text-xs text-danger-600" role="alert">
                {errors.categoryId.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="ask-question" className="sr-only">
            السؤال
          </label>
          <textarea
            id="ask-question"
            rows={5}
            placeholder={adviceCopy.questionPlaceholder}
            className={cn(
              'w-full resize-y rounded-md border border-[#d8d8d8] bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              errors.question && 'border-danger-500',
            )}
            aria-invalid={Boolean(errors.question)}
            aria-describedby={errors.question ? 'ask-question-error' : undefined}
            {...register('question')}
          />
          {errors.question ? (
            <p id="ask-question-error" className="mt-1 text-xs text-danger-600" role="alert">
              {errors.question.message}
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
            className: 'h-11 w-full rounded-md text-sm font-bold',
          })}
        >
          {adviceCopy.submitQuestion}
        </button>
      </form>
    </section>
  );
}
