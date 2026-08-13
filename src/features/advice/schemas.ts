import { z } from 'zod';
import { adviceCategories } from './config';

const categoryIds = adviceCategories.map((item) => item.id) as [
  string,
  ...string[],
];

export const adviceQuestionFiltersSchema = z.object({
  locationId: z.string().trim().min(1).optional(),
  categoryId: z.enum(categoryIds).optional(),
  view: z.enum(['popular', 'unanswered', 'all']).default('popular'),
  page: z.coerce.number().int().positive().default(1),
  transaction: z.enum(['sale', 'rent']).default('sale'),
});

export const createAdviceQuestionSchema = z.object({
  locationId: z.string().trim().min(1, 'اختر المنطقة'),
  categoryId: z
    .string()
    .trim()
    .min(1, 'اختر القسم')
    .refine((value) => categoryIds.includes(value), 'اختر القسم'),
  question: z
    .string()
    .trim()
    .min(15, 'السؤال يجب أن يكون 15 حرفاً على الأقل')
    .max(500, 'السؤال يجب ألا يتجاوز 500 حرف'),
});

export const createAdviceAnswerSchema = z.object({
  questionId: z.string().trim().min(1),
  answer: z
    .string()
    .trim()
    .min(10, 'الإجابة يجب أن تكون 10 أحرف على الأقل')
    .max(1500, 'الإجابة يجب ألا تتجاوز 1500 حرف'),
});

export type CreateAdviceQuestionValues = z.infer<
  typeof createAdviceQuestionSchema
>;
export type CreateAdviceAnswerValues = z.infer<typeof createAdviceAnswerSchema>;
