import { z } from 'zod';

export const managedListingStatusSchema = z.enum([
  'published',
  'rejected',
  'expired',
  'pending',
  'deleted',
  'draft',
]);

export const managedListingSortSchema = z.enum([
  'newest',
  'oldest',
  'most_viewed',
  'most_contacted',
]);

export const myPropertiesQuerySchema = z.object({
  status: managedListingStatusSchema.default('published'),
  q: z.string().trim().max(120).optional().default(''),
  sort: managedListingSortSchema.default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(24).default(8),
});

export type MyPropertiesQuery = z.infer<typeof myPropertiesQuerySchema>;
