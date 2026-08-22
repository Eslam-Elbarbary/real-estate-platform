import { z } from 'zod';

const commercialRoleSchema = z.enum([
  'owner',
  'marketer',
  'marketing_company',
  'compound_developer',
]);

/** Future Express: POST /marketing-leads */
export const marketingLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'يرجى إدخال الاسم')
    .max(80, 'الاسم طويل جدًا'),
  phone: z
    .string()
    .trim()
    .min(8, 'يرجى إدخال رقم هاتف صحيح')
    .max(20, 'رقم الهاتف طويل جدًا'),
  email: z
    .string()
    .trim()
    .email('يرجى إدخال بريد إلكتروني صحيح')
    .max(120),
  company: z
    .string()
    .trim()
    .min(2, 'يرجى إدخال اسم الشركة')
    .max(120, 'اسم الشركة طويل جدًا'),
  businessType: commercialRoleSchema,
  address: z
    .string()
    .trim()
    .min(3, 'يرجى إدخال عنوان الشركة')
    .max(200, 'العنوان طويل جدًا'),
});

export type MarketingLeadFormValues = z.infer<typeof marketingLeadSchema>;
