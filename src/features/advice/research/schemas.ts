import { z } from 'zod';
import { researchRequestTypes } from './types';

const required = (message: string) =>
  z.string().trim().min(1, message);

const baseFields = {
  name: required('يرجى إدخال الاسم').max(80, 'الاسم طويل جدًا'),
  company: required('يرجى إدخال اسم الشركة / الجهة').max(120, 'الاسم طويل جدًا'),
  email: z.string().trim().email('يرجى إدخال بريد إلكتروني صحيح').max(120),
  phone: required('يرجى إدخال رقم الهاتف')
    .min(8, 'يرجى إدخال رقم هاتف صحيح')
    .max(20, 'رقم الهاتف طويل جدًا'),
  jobTitle: required('يرجى إدخال المسمى الوظيفي').max(80),
  city: z.string().trim().max(80).optional().or(z.literal('')),
};

export const trendsReportSchema = z.object({
  type: z.literal('trends-report'),
  ...baseFields,
  usageType: required('يرجى اختيار نوع الاستخدام'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
});

export const marketImpactReportSchema = z.object({
  type: z.literal('market-impact-report'),
  ...baseFields,
  sector: required('يرجى إدخال القطاع أو المجال'),
  region: required('يرجى إدخال المنطقة الجغرافية'),
  purpose: required('يرجى إدخال الغرض من التقرير'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
});

export const priceDataSchema = z.object({
  type: z.literal('price-data'),
  ...baseFields,
  city: required('يرجى إدخال المدينة'),
  areas: required('يرجى إدخال المنطقة أو المناطق'),
  propertyKind: required('يرجى اختيار نوع العقار'),
  dataKinds: z.array(z.string()).min(1, 'يرجى اختيار نوع البيانات المطلوبة'),
  period: required('يرجى اختيار الفترة الزمنية'),
});

export const customStudySchema = z.object({
  type: z.literal('custom-study'),
  ...baseFields,
  projectName: required('يرجى إدخال اسم المشروع / الشركة'),
  targetArea: required('يرجى إدخال المدينة أو المنطقة المستهدفة'),
  projectKind: required('يرجى اختيار نوع المشروع'),
  studyKinds: z.array(z.string()).min(1, 'يرجى اختيار نوع الدراسة'),
  needDescription: required('يرجى وصف احتياجك').min(
    30,
    'يرجى كتابة وصف لا يقل عن 30 حرفاً',
  ),
  timeline: required('يرجى اختيار المدة المتوقعة'),
});

export const contactRequestSchema = z.object({
  type: z.literal('contact'),
  ...baseFields,
  inquiryType: required('يرجى اختيار نوع الاستفسار'),
  message: required('يرجى إدخال الرسالة').min(10, 'الرسالة قصيرة جدًا'),
});

export const researchRequestSchema = z.discriminatedUnion('type', [
  trendsReportSchema,
  marketImpactReportSchema,
  priceDataSchema,
  customStudySchema,
  contactRequestSchema,
]);

export const researchRequestTypeSchema = z.enum(researchRequestTypes);

export type ResearchRequestValues = z.infer<typeof researchRequestSchema>;
export type TrendsReportValues = z.infer<typeof trendsReportSchema>;
export type MarketImpactReportValues = z.infer<typeof marketImpactReportSchema>;
export type PriceDataValues = z.infer<typeof priceDataSchema>;
export type CustomStudyValues = z.infer<typeof customStudySchema>;
export type ContactRequestValues = z.infer<typeof contactRequestSchema>;
