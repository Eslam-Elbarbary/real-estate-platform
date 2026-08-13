import { z } from 'zod';
import { adviceArticleCategories } from './config';

const categoryIds = adviceArticleCategories.map((item) => item.id) as [
  string,
  ...string[],
];

export const adviceArticleFiltersSchema = z.object({
  categoryId: z.enum(categoryIds).optional(),
  page: z.coerce.number().int().positive().default(1),
});
