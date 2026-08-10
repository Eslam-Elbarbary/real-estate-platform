import { z } from 'zod';
import { routes } from '@/config/routes';
import { getSubscriptionPlanById } from './config';

export const subscriptionBillingPeriodSchema = z.enum([
  'monthly',
  'quarterly',
  'yearly',
]);

export const proCheckoutQuerySchema = z
  .object({
    plan: z.string().min(1).default('general-pro'),
    billing: subscriptionBillingPeriodSchema.default('quarterly'),
  })
  .superRefine((value, ctx) => {
    const plan = getSubscriptionPlanById(value.plan);
    if (!plan) {
      ctx.addIssue({
        code: 'custom',
        path: ['plan'],
        message: 'INVALID_PLAN',
      });
      return;
    }
    const allowed = plan.billingOptions ?? [
      plan.billingPeriod ?? 'monthly',
    ];
    if (!allowed.includes(value.billing)) {
      ctx.addIssue({
        code: 'custom',
        path: ['billing'],
        message: 'INVALID_BILLING',
      });
    }
  });

export type ProCheckoutQuery = z.infer<typeof proCheckoutQuerySchema>;

export function parseProCheckoutSearchParams(
  input: Record<string, string | string[] | undefined>,
): ProCheckoutQuery {
  const plan = Array.isArray(input.plan) ? input.plan[0] : input.plan;
  const billing = Array.isArray(input.billing)
    ? input.billing[0]
    : input.billing;

  const parsed = proCheckoutQuerySchema.safeParse({
    plan: plan || 'general-pro',
    billing: billing || 'quarterly',
  });

  if (parsed.success) return parsed.data;

  return { plan: 'general-pro', billing: 'quarterly' };
}

export function buildProCheckoutHref(input: {
  plan: string;
  billing: string;
}): string {
  const params = new URLSearchParams({
    plan: input.plan,
    billing: input.billing,
  });
  return `${routes.pro.checkout}?${params.toString()}`;
}
