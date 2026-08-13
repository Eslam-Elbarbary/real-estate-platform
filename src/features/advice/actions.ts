'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import {
  createAdviceAnswerSchema,
  createAdviceQuestionSchema,
} from './schemas';
import { authorFromAuthUser, getAdviceService } from './service';

function redirectTo(path: string): never {
  redirect(encodeURI(path));
}

export type AdviceActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fieldErrorsFromZod(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function demoErrorMessage(error: unknown): string | null {
  if (!(error instanceof Error)) return null;
  if (error.message === 'INVALID_LOCATION') return 'اختر منطقة صحيحة';
  if (error.message === 'INVALID_CATEGORY') return 'اختر قسماً صحيحاً';
  if (error.message === 'DEMO_QUESTION_LIMIT') {
    return 'وصلت للحد الأقصى من الأسئلة في العرض التجريبي';
  }
  if (error.message === 'DEMO_ANSWER_LIMIT') {
    return 'وصلت للحد الأقصى من الإجابات في العرض التجريبي';
  }
  if (error.message === 'DEMO_STORE_LIMIT') {
    return 'تعذر الحفظ في العرض التجريبي';
  }
  if (error.message === 'QUESTION_NOT_FOUND') return 'السؤال غير موجود';
  return null;
}

export async function createAdviceQuestionAction(
  input: unknown,
): Promise<AdviceActionResult> {
  const session = await getServerSession();
  if (!session) {
    redirectTo(
      routes.auth.loginWithReturnTo(`${routes.advice.ask.root}#ask-form`),
    );
  }

  const parsed = createAdviceQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'أكمل الحقول المطلوبة',
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  let question;
  try {
    question = await getAdviceService().createQuestion(
      parsed.data,
      authorFromAuthUser(session.user),
    );
  } catch (error) {
    const message = demoErrorMessage(error);
    if (message) {
      return {
        ok: false,
        error: message,
        fieldErrors:
          error instanceof Error && error.message === 'INVALID_LOCATION'
            ? { locationId: message }
            : undefined,
      };
    }
    throw error;
  }

  revalidatePath(routes.advice.ask.root);
  redirectTo(`${routes.advice.ask.question(question.id, question.slug)}?created=1`);
}

export async function addAdviceAnswerAction(
  input: unknown,
): Promise<AdviceActionResult> {
  const parsed = createAdviceAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'أكمل الإجابة',
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const existing = await getAdviceService().getQuestionById(
    parsed.data.questionId,
  );
  const returnTo = existing
    ? `${routes.advice.ask.question(existing.id, existing.slug)}#answer-form`
    : `${routes.advice.ask.root}#ask-form`;

  const session = await getServerSession();
  if (!session) {
    redirectTo(routes.auth.loginWithReturnTo(returnTo));
  }

  if (!existing) {
    return { ok: false, error: 'السؤال غير موجود' };
  }

  try {
    await getAdviceService().addAnswer(
      parsed.data.questionId,
      { body: parsed.data.answer },
      authorFromAuthUser(session.user),
    );
  } catch (error) {
    const message = demoErrorMessage(error);
    if (message) return { ok: false, error: message };
    throw error;
  }

  revalidatePath(routes.advice.ask.question(existing.id, existing.slug));
  revalidatePath(routes.advice.ask.root);
  redirectTo(`${routes.advice.ask.question(existing.id, existing.slug)}?answered=1`);
}
