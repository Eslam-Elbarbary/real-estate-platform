import { z } from 'zod';

export const marketIndexFiltersSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const marketIndexPeriodSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});
