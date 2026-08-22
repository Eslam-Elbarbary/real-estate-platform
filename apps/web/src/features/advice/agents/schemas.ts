import { z } from 'zod';

export const agentDirectoryFiltersSchema = z.object({
  type: z.enum(['company', 'broker']).default('company'),
  locationId: z.string().min(1).optional(),
  q: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().positive().default(1),
});
