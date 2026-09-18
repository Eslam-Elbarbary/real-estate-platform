import { z } from 'zod';
import { isDetailFieldVisible } from '@repo/types';

export const basicStepSchema = z.object({
  transaction: z.enum(['sale', 'rent']),
  propertyType: z.string().min(1),
  countryId: z.string().min(1),
  cityId: z.string().min(1),
  areaId: z.string().min(1),
  districtId: z.string().nullish(),
  compoundId: z.string().nullish(),
  address: z.string().nullish(),
  locationLabel: z.string().optional().default(''),
  latitude: z.number().finite().optional().nullable(),
  longitude: z.number().finite().optional().nullable(),
});

export const detailsStepSchema = z
  .object({
    areaSqm: z.number().positive(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    floor: z.union([z.number(), z.string()]).optional(),
    buildOrDeliveryYear: z.number().int().optional(),
    furnished: z.boolean().optional(),
    finishing: z.string().optional(),
    propertyViewIds: z.array(z.string()).optional(),
    legalStatusId: z.string().optional(),
    mortgageEligible: z.boolean().optional(),
    amenities: z.array(z.string()).default([]),
    /** Injected by action for type-aware validation */
    propertyType: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    const type = value.propertyType ?? null;

    // Only validate visible detail fields.
    if (
      isDetailFieldVisible('yearBuilt', type) &&
      value.buildOrDeliveryYear != null &&
      (value.buildOrDeliveryYear < 1950 || value.buildOrDeliveryYear > 2035)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['buildOrDeliveryYear'],
        message: 'سنة البناء غير صالحة',
      });
    }

    if (
      isDetailFieldVisible('bedrooms', type) &&
      value.bedrooms != null &&
      value.bedrooms < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bedrooms'],
        message: 'عدد الغرف غير صالح',
      });
    }

    if (
      isDetailFieldVisible('bathrooms', type) &&
      value.bathrooms != null &&
      value.bathrooms < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bathrooms'],
        message: 'عدد الحمامات غير صالح',
      });
    }
  });

export const pricingStepSchema = z
  .object({
    price: z.number().positive('السعر مطلوب ويجب أن يكون أكبر من صفر.'),
    currency: z.string().min(1, 'العملة مطلوبة.'),
    paymentType: z
      .enum(['CASH', 'INSTALLMENT', 'CASH_OR_INSTALLMENT', ''])
      .optional(),
    downPayment: z.number().nonnegative().optional(),
    installmentYears: z.number().int().positive().optional(),
    monthlyInstallment: z.number().nonnegative().optional(),
    rentPeriod: z.enum(['DAILY', 'MONTHLY', 'YEARLY', '']).optional(),
    /** sale | rent — injected by action for validation context */
    transaction: z.enum(['sale', 'rent']).optional(),
  })
  .superRefine((value, ctx) => {
    const isRent = value.transaction === 'rent';
    const isSale = value.transaction === 'sale' || value.transaction == null;

    if (isRent) {
      if (!value.rentPeriod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rentPeriod'],
          message: 'فترة الإيجار مطلوبة.',
        });
      }
      return;
    }

    if (!isSale) return;

    if (!value.paymentType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paymentType'],
        message: 'طريقة الدفع مطلوبة.',
      });
      return;
    }

    if (value.paymentType === 'CASH') {
      if (value.downPayment != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['downPayment'],
          message: 'المقدم غير مسموح مع الدفع النقدي.',
        });
      }
      if (value.installmentYears != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['installmentYears'],
          message: 'سنوات التقسيط غير مسموحة مع الدفع النقدي.',
        });
      }
      if (value.monthlyInstallment != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthlyInstallment'],
          message: 'القسط الشهري غير مسموح مع الدفع النقدي.',
        });
      }
      return;
    }

    if (value.paymentType === 'INSTALLMENT') {
      if (value.installmentYears == null || value.installmentYears < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['installmentYears'],
          message: 'عدد سنوات التقسيط مطلوب ويجب أن يكون سنة واحدةً على الأقل.',
        });
      }
      if (value.monthlyInstallment == null || value.monthlyInstallment <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthlyInstallment'],
          message: 'القسط الشهري مطلوب ويجب أن يكون أكبر من صفر.',
        });
      }
      if (value.downPayment != null && value.downPayment < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['downPayment'],
          message: 'المقدم يجب ألا يكون سالباً.',
        });
      }
    }

    if (value.paymentType === 'CASH_OR_INSTALLMENT') {
      if (value.installmentYears != null && value.installmentYears < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['installmentYears'],
          message: 'عدد سنوات التقسيط يجب أن يكون سنةً على الأقل.',
        });
      }
      if (value.monthlyInstallment != null && value.monthlyInstallment <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthlyInstallment'],
          message: 'القسط الشهري يجب أن يكون أكبر من صفر عند إدخاله.',
        });
      }
    }
  });

export const descriptionStepSchema = z.object({
  ar: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    address: z.string().min(3),
  }),
  en: z.object({
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    address: z.string().optional().default(''),
  }),
});

export const mediaStepSchema = z.object({
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().min(1),
        name: z.string(),
        size: z.number(),
        order: z.number(),
        isCover: z.boolean(),
      }),
    )
    .min(1),
  videoUrl: z.string().optional(),
});

export const contactStepSchema = z
  .object({
    contactSource: z.enum(['OWNER', 'CUSTOM']),
    contactType: z.enum(['OWNER', 'AGENT', 'COMPANY']),
    contactName: z.string().default(''),
    phone: z.string().default(''),
    whatsapp: z.string().default(''),
    email: z.string().default(''),
  })
  .superRefine((value, ctx) => {
    const phoneDigits = value.phone.replace(/\D/g, '');
    if (value.contactSource === 'OWNER') {
      if (phoneDigits.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message:
            'حسابك لا يحتوي على رقم هاتف. أضف رقماً في الملف الشخصي أو اختر بيانات تواصل مختلفة.',
        });
      }
      return;
    }

    if (!value.contactName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactName'],
        message: 'اسم جهة التواصل مطلوب.',
      });
    }
    if (phoneDigits.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'رقم الهاتف مطلوب.',
      });
    }
    const email = value.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'البريد الإلكتروني غير صالح.',
      });
    }
  });

export type BasicStepInput = z.infer<typeof basicStepSchema>;
export type DetailsStepInput = z.infer<typeof detailsStepSchema>;
export type PricingStepInput = z.infer<typeof pricingStepSchema>;
export type DescriptionStepInput = z.infer<typeof descriptionStepSchema>;
export type ContactStepInput = z.infer<typeof contactStepSchema>;
export type MediaStepInput = z.infer<typeof mediaStepSchema>;
