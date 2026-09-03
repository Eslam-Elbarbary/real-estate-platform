import { z } from 'zod';

const egyptMobileRegex = /^(01)[0125][0-9]{8}$/;
const e164EgyptRegex = /^\+20[0-9]{10}$/;

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('أدخل بريدًا إلكترونيًا صالحًا')
  .max(255, 'البريد الإلكتروني طويل جدًا');

export const loginEmailSchema = z.object({
  email: emailSchema,
});

export const loginPasswordSchema = z.object({
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  rememberMe: z.boolean().optional(),
});

export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  rememberMe: z.boolean().optional(),
});

/** @deprecated Email-only login — use loginEmailSchema */
export const identifierSchema = emailSchema;

/** @deprecated Email-only login — use loginEmailSchema */
export const loginIdentifierSchema = loginEmailSchema;

export const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب ألا تقل عن 8 أحرف')
  .max(128, 'كلمة المرور طويلة جدًا')
  .regex(/[A-Za-z]/, 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
  .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'الاسم الأول مطلوب')
    .max(80, 'الاسم الأول طويل جدًا'),
  lastName: z
    .string()
    .trim()
    .min(1, 'اسم العائلة مطلوب')
    .max(80, 'اسم العائلة طويل جدًا'),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value || egyptMobileRegex.test(value) || e164EgyptRegex.test(value),
      'أدخل رقم موبايل مصري صالح (مثال: 01012345678)',
    ),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(10, 'رابط التفعيل غير صالح'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(10, 'رابط إعادة التعيين غير صالح'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type LoginEmailValues = z.infer<typeof loginEmailSchema>;
export type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;
export type LoginCredentialsValues = z.infer<typeof loginCredentialsSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/** @deprecated */
export type LoginIdentifierValues = LoginEmailValues;
