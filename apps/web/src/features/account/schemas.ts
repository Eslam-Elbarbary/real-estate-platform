import { z } from 'zod';

const egyptMobileRegex = /^(01)[0125][0-9]{8}$/;

export const accountNameSchema = z
  .string()
  .trim()
  .min(1, 'مطلوب')
  .max(80, 'الاسم طويل جدًا');

export const accountPhoneSchema = z
  .string()
  .trim()
  .regex(egyptMobileRegex, 'أدخل رقم موبايل مصري صالح (مثال: 01012345678)');

export const updateProfileNameSchema = z.object({
  firstName: accountNameSchema,
  lastName: accountNameSchema,
});

export const updateProfilePhoneSchema = z.object({
  phone: accountPhoneSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z
      .string()
      .min(8, 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف')
      .max(128, 'كلمة المرور طويلة جدًا')
      .regex(/[A-Za-z]/, 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
      .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: 'كلمة المرور الجديدة يجب أن تختلف عن الحالية',
    path: ['newPassword'],
  });

export const addContactPhoneSchema = z.object({
  phone: accountPhoneSchema,
});

export const demoCardSchema = z.object({
  nickname: z.string().trim().min(2, 'اسم البطاقة مطلوب').max(40),
});

export type UpdateProfileNameValues = z.infer<typeof updateProfileNameSchema>;
export type UpdateProfilePhoneValues = z.infer<typeof updateProfilePhoneSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type AddContactPhoneValues = z.infer<typeof addContactPhoneSchema>;
export type DemoCardValues = z.infer<typeof demoCardSchema>;
