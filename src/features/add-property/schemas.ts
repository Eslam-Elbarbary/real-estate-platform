import { z } from 'zod';
import { propertyTypeOptions } from '@/config/property-types';

const propertyTypeValues = propertyTypeOptions.map((o) => o.value) as [
  (typeof propertyTypeOptions)[number]['value'],
  ...(typeof propertyTypeOptions)[number]['value'][],
];

export const basicStepSchema = z.object({
  transaction: z.enum(['sale', 'rent']),
  propertyType: z.enum(propertyTypeValues),
  locationId: z.string().min(1),
  locationLabel: z.string().min(1),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
});

export const detailsStepSchema = z.object({
  areaSqm: z.number().positive(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floor: z.union([z.number(), z.string()]).optional(),
  buildOrDeliveryYear: z.number().int().min(1950).max(2035).optional(),
  views: z.array(z.string()).default([]),
  finishing: z.string().optional(),
  registrationStatus: z.string().optional(),
  mortgageEligible: z.boolean().optional(),
  amenities: z.array(z.string()).default([]),
});

export const developerPricingSchema = z.object({
  mode: z.literal('developer'),
  cashPrice: z.number().positive().optional(),
  installmentTotalPrice: z.number().positive().optional(),
  downPayment: z.object({
    mode: z.enum(['egp', 'percent']),
    value: z.number().nonnegative().optional(),
  }),
  installmentDurationMonths: z.number().int().positive().optional(),
});

export const ownerCashPricingSchema = z.object({
  mode: z.literal('owner_cash'),
  price: z.number().positive(),
});

export const ownerInstallmentPricingSchema = z.object({
  mode: z.literal('owner_installments'),
  contractPrice: z.number().positive(),
  overPrice: z.number().nonnegative().optional(),
  maintenanceDeposit: z.number().nonnegative().optional(),
  totalPaid: z.number().nonnegative(),
  remainingInstallmentMonths: z.number().int().positive(),
});

export const rentPricingSchema = z.object({
  mode: z.literal('rent'),
  price: z.number().positive(),
  pricingPeriod: z.enum(['monthly', 'daily', 'yearly']).default('monthly'),
});

export const pricingStepSchema = z.discriminatedUnion('mode', [
  developerPricingSchema,
  ownerCashPricingSchema,
  ownerInstallmentPricingSchema,
  rentPricingSchema,
]);

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
        previewUrl: z.string(),
        name: z.string(),
        size: z.number(),
        order: z.number(),
        isCover: z.boolean(),
      }),
    )
    .min(1),
  videoUrl: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || !v.trim()) return undefined;
      try {
        new URL(v);
        return v;
      } catch {
        return undefined;
      }
    }),
});

export type BasicStepInput = z.infer<typeof basicStepSchema>;
export type DetailsStepInput = z.infer<typeof detailsStepSchema>;
export type PricingStepInput = z.infer<typeof pricingStepSchema>;
export type DescriptionStepInput = z.infer<typeof descriptionStepSchema>;
export type MediaStepInput = z.infer<typeof mediaStepSchema>;
