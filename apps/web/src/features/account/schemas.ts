import { z } from 'zod';

const egyptMobileRegex = /^(01)[0125][0-9]{8}$/;

export const accountNameSchema = z
  .string()
  .trim()
  .min(2, 'الاسم مطلوب')
  .max(80, 'الاسم طويل جدًا');

export const accountEmailSchema = z
  .string()
  .trim()
  .email('البريد الإلكتروني غير صالح');

export const accountPasswordSchema = z
  .string()
  .min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف');

export const accountPhoneSchema = z
  .string()
  .trim()
  .regex(egyptMobileRegex, 'أدخل رقم موبايل مصري صالح (مثال: 01012345678)');

export const updateProfileNameSchema = z.object({
  name: accountNameSchema,
});

export const updateProfileEmailSchema = z.object({
  email: accountEmailSchema,
});

export const updateProfilePasswordSchema = z.object({
  password: accountPasswordSchema,
});

export const updateProfilePhoneSchema = z.object({
  phone: accountPhoneSchema,
});

export const addContactPhoneSchema = z.object({
  phone: accountPhoneSchema,
});

export const demoCardSchema = z.object({
  nickname: z.string().trim().min(2, 'اسم البطاقة مطلوب').max(40),
});

export type UpdateProfileNameValues = z.infer<typeof updateProfileNameSchema>;
export type UpdateProfileEmailValues = z.infer<typeof updateProfileEmailSchema>;
export type UpdateProfilePasswordValues = z.infer<
  typeof updateProfilePasswordSchema
>;
export type UpdateProfilePhoneValues = z.infer<typeof updateProfilePhoneSchema>;
export type AddContactPhoneValues = z.infer<typeof addContactPhoneSchema>;
export type DemoCardValues = z.infer<typeof demoCardSchema>;
