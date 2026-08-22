import { z } from 'zod';

export const valuationGoalSchema = z.enum(['owned-property', 'price-inquiry']);

export const valuationLocationSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  citySlug: z.string().optional(),
  governorateSlug: z.string().optional(),
});

export const valuationDraftSchema = z.object({
  goal: valuationGoalSchema.optional(),
  location: valuationLocationSchema.optional(),
  propertyType: z
    .enum([
      'apartment',
      'villa',
      'townhouse',
      'duplex',
      'penthouse',
      'studio',
      'chalet',
      'office',
      'shop',
      'land',
    ])
    .optional(),
  view: z
    .enum([
      'nile',
      'golf',
      'lake',
      'plaza',
      'club',
      'rear',
      'garden',
      'pool',
      'sea',
      'corner',
      'side_street',
      'main_street',
      'other',
    ])
    .optional(),
  finishing: z
    .enum([
      'unfinished',
      'semi_finished',
      'finished',
      'lux',
      'super_lux',
      'extra_super_lux',
    ])
    .optional(),
  area: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  purchasePrice: z.number().positive().optional(),
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
  currentOwnerEstimate: z.number().positive().optional(),
});

export type ValuationDraft = z.infer<typeof valuationDraftSchema>;
