import type {
  SubscriptionBillingPeriod,
  SubscriptionPlan,
} from '@/features/account/types';

export const subscriptionCopy = {
  planPageTitle: 'اختر خطتك المثالية',
  planPageSubtitle:
    'اختر الخطة التي تناسبك واستمتع بمزايا غير محدودة وبأفضل سعر',
  subscribeCta: 'اشترك الآن',
  checkoutPaymentTitle: 'تفاصيل الدفع',
  checkoutSummaryTitle: 'ملخص الطلب',
  changePlan: 'تغيير الخطة',
  packagePrice: 'سعر الباقة',
  discountLabel: (percent: number) => `خصم ${percent}%`,
  totalDue: 'إجمالي المستحق',
  pay: 'ادفع',
  addCard: 'اضف بطاقة جديدة',
  autoRenewQuarterly:
    'سيتم التجديد تلقائيًا كل 3 أشهر، ويمكنك الإلغاء في أي وقت.',
  autoRenewYearly:
    'سيتم التجديد تلقائيًا كل سنة، ويمكنك الإلغاء في أي وقت.',
  autoRenewMonthly:
    'سيتم التجديد تلقائيًا كل شهر، ويمكنك الإلغاء في أي وقت.',
  successTitle: 'تم تأكيد الاشتراك التجريبي',
  successHint: 'تم تفعيل الاشتراك التجريبي دون أي دفع حقيقي.',
  demoCardModalTitle: 'إضافة وسيلة دفع تجريبية',
  demoCardOption: 'Visa •••• 4242',
  demoCardUse: 'استخدام البطاقة التجريبية',
  demoCardCancel: 'إلغاء',
  selectPaymentHint: 'اختر وسيلة دفع تجريبية لتفعيل زر الدفع',
  activeStatus: 'نشط',
  cancelledStatus: 'ملغى',
  expiresAt: 'ينتهي في',
  startedAt: 'تاريخ البدء',
  billingPeriod: 'فترة الفوترة',
  autoRenew: 'التجديد التلقائي',
  cancelSubscription: 'إلغاء الاشتراك',
  cancelConfirmTitle: 'إلغاء الاشتراك؟',
  cancelConfirmBody:
    'سيتم إلغاء الاشتراك التجريبي فقط. لا توجد مدفوعات أو استردادات فعلية.',
  cancelConfirmContinue: 'تأكيد الإلغاء',
  cancelConfirmClose: 'إبقاء الاشتراك',
  billingQuarterly: 'ربع سنوي',
  billingYearly: 'سنويًا',
  billingMonthly: 'شهري',
  saveBadge: (percent: number) => `وفر ${percent}%`,
  perQuarter: '/ 3 شهور',
  perYear: '/ سنة',
  perMonth: '/ شهر',
  seoTitle: 'عقارات مصر برو',
  seoDescription:
    'اشترك في عقارات مصر برو واستمتع بمزايا التقييم والفلاتر المتقدمة وتقارير الخبراء.',
} as const;

const sharedProFeatures = [
  {
    id: 'area-rating',
    label: 'تقييم المنطقة وخدماتها',
    included: true as const,
  },
  {
    id: 'avg-price',
    label: 'متوسط السعر في منطقتك',
    included: true as const,
  },
  {
    id: 'valuation-tool',
    label: 'أداة تقييم العقار',
    included: true as const,
  },
  {
    id: 'listing-ratings',
    label: 'تقييمات الإعلانات',
    included: true as const,
  },
  {
    id: 'compound-report',
    label: 'تقرير الخبراء عن الكمبوند',
    included: true as const,
  },
  {
    id: 'advanced-filters',
    label: 'فلاتر متقدمة لبحث أفضل',
    included: true as const,
  },
  {
    id: 'ad-stats',
    label: 'إحصائيات الإعلان',
    included: true as const,
  },
];

/** Exact visible reference values from docs/reference/pro_subscription. */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'general-pro',
    audience: 'general',
    title: 'عقارات مصر برو - ربع سنوي',
    billingPeriod: 'quarterly',
    billingOptions: ['quarterly', 'yearly'],
    durationMonths: 3,
    priceEgp: 299,
    originalPriceEgp: 400,
    discountPercent: 25,
    includesPropertyListing: false,
    listingExclusionWarning: 'هذا الاشتراك لا يشمل إضافة عقار',
    highlighted: true,
    badge: 'وفر 25%',
    features: sharedProFeatures,
  },
  {
    id: 'owner-pro',
    audience: 'property_owner',
    title: 'برو (مالك عقار)',
    billingPeriod: 'monthly',
    billingOptions: ['monthly'],
    durationMonths: 1,
    priceEgp: 750,
    pointsIncluded: 10,
    includesPropertyListing: true,
    features: [
      {
        id: 'points',
        label: '10 نقاط (لإضافة إعلانات)',
        included: true,
        value: 10,
      },
      {
        id: 'sale-validity',
        label: 'صلاحية إعلان البيع',
        included: true,
        value: '6 أشهر',
      },
      {
        id: 'rent-validity',
        label: 'صلاحية إعلان الإيجار',
        included: true,
        value: '6 أشهر',
      },
      ...sharedProFeatures,
    ],
  },
];

/** Yearly pricing for general Pro — from checkout reference. */
export const generalProYearly = {
  priceEgp: 599,
  originalPriceEgp: 1_200,
  discountPercent: 50,
  durationMonths: 12,
  title: 'عقارات مصر برو - سنوي',
} as const;

export function getSubscriptionPlanById(id: string): SubscriptionPlan | null {
  return subscriptionPlans.find((plan) => plan.id === id) ?? null;
}

export function resolvePlanPricing(
  plan: SubscriptionPlan,
  billing: SubscriptionBillingPeriod,
): {
  title: string;
  priceEgp: number;
  originalPriceEgp?: number;
  discountPercent?: number;
  durationMonths: number;
  periodLabel: string;
} {
  if (plan.id === 'general-pro' && billing === 'yearly') {
    return {
      title: generalProYearly.title,
      priceEgp: generalProYearly.priceEgp,
      originalPriceEgp: generalProYearly.originalPriceEgp,
      discountPercent: generalProYearly.discountPercent,
      durationMonths: generalProYearly.durationMonths,
      periodLabel: subscriptionCopy.perYear,
    };
  }

  if (plan.id === 'general-pro' && billing === 'quarterly') {
    return {
      title: 'عقارات مصر برو - ربع سنوي',
      priceEgp: 299,
      originalPriceEgp: 400,
      discountPercent: 25,
      durationMonths: 3,
      periodLabel: subscriptionCopy.perQuarter,
    };
  }

  return {
    title: plan.title,
    priceEgp: plan.priceEgp,
    originalPriceEgp: plan.originalPriceEgp,
    discountPercent: plan.discountPercent,
    durationMonths: plan.durationMonths ?? 1,
    periodLabel:
      billing === 'yearly'
        ? subscriptionCopy.perYear
        : billing === 'quarterly'
          ? subscriptionCopy.perQuarter
          : subscriptionCopy.perMonth,
  };
}
