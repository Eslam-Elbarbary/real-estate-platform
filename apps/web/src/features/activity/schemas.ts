import { z } from 'zod';

export const createAlertSchema = z
  .object({
    locationSlugs: z.array(z.string().min(1)).min(1, 'اختر منطقة واحدة على الأقل'),
    propertyType: z.string().min(1),
    transaction: z.enum(['sale', 'rent']),
    minPrice: z.coerce.number().positive().optional().or(z.literal('')),
    maxPrice: z.coerce.number().positive().optional().or(z.literal('')),
    minArea: z.coerce.number().positive().optional().or(z.literal('')),
    maxArea: z.coerce.number().positive().optional().or(z.literal('')),
  })
  .superRefine((value, ctx) => {
    const minPrice =
      value.minPrice === '' || value.minPrice === undefined
        ? undefined
        : Number(value.minPrice);
    const maxPrice =
      value.maxPrice === '' || value.maxPrice === undefined
        ? undefined
        : Number(value.maxPrice);
    if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
      ctx.addIssue({
        code: 'custom',
        path: ['maxPrice'],
        message: 'أعلى سعر يجب أن يكون أكبر من أو يساوي أقل سعر',
      });
    }
  });

export const createNoteSchema = z.object({
  body: z.string().trim().min(2, 'يرجى كتابة ملاحظة').max(500),
});

export type CreateAlertFormValues = z.infer<typeof createAlertSchema>;
export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;
