import { z } from 'zod';

const egyptMobileRegex = /^(01)[0125][0-9]{8}$/;

export const identifierSchema = z
  .string()
  .trim()
  .min(1, 'البريد الإلكتروني أو رقم الهاتف مطلوب')
  .refine(
    (value) =>
      z.string().email().safeParse(value).success || egyptMobileRegex.test(value),
    'أدخل بريدًا إلكترونيًا صالحًا أو رقم موبايل مصري',
  );

export const loginIdentifierSchema = z.object({
  identifier: identifierSchema,
});

export const loginPasswordSchema = z.object({
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'الاسم مطلوب'),
  email: z.string().trim().email('البريد الإلكتروني غير صالح'),
  phone: z
    .string()
    .trim()
    .regex(egyptMobileRegex, 'أدخل رقم موبايل مصري صالح (مثال: 01012345678)'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
});

export type LoginIdentifierValues = z.infer<typeof loginIdentifierSchema>;
export type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

/** Fictional reserved identifiers for demo duplicate-error states only. */
export const RESERVED_DEMO_EMAILS = new Set([
  'taken@example.test',
  'exists@example.test',
]);

export const RESERVED_DEMO_PHONES = new Set(['01111111111', '01222222222']);
