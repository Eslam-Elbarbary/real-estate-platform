'use server';

import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getSubscriptionService } from '@/features/account/service';
import { subscriptionBillingPeriodSchema } from '@/features/subscriptions/search-params';
import type { UserSubscription } from '@/features/account/types';
import { z } from 'zod';

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const activateSchema = z.object({
  planId: z.string().min(1),
  billingPeriod: subscriptionBillingPeriodSchema,
});

export async function activateDemoSubscriptionAction(input: {
  planId: string;
  billingPeriod: string;
}): Promise<ActionResult<UserSubscription>> {
  const session = await getServerSession();
  if (!session) {
    return { ok: false, error: 'يجب تسجيل الدخول أولاً' };
  }

  const parsed = activateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'بيانات الاشتراك غير صالحة' };
  }

  try {
    const data = await getSubscriptionService().activateDemoSubscription({
      userId: session.user.id,
      planId: parsed.data.planId,
      billingPeriod: parsed.data.billingPeriod,
    });
    revalidatePath(routes.account.subscription);
    revalidatePath(routes.pro.root);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'تعذر تفعيل الاشتراك',
    };
  }
}

export async function cancelDemoSubscriptionAction(): Promise<
  ActionResult<UserSubscription | null>
> {
  const session = await getServerSession();
  if (!session) {
    return { ok: false, error: 'يجب تسجيل الدخول أولاً' };
  }

  try {
    const data = await getSubscriptionService().cancelDemoSubscription(
      session.user.id,
    );
    revalidatePath(routes.account.subscription);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'تعذر إلغاء الاشتراك',
    };
  }
}
