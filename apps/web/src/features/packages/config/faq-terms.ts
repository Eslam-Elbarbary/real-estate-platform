export interface PackageFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PackageTermsContent {
  intro: string;
  bullets: string[];
  disclaimer: string;
}

/** Shared demo FAQ — original concise copy (not verbatim reference text). */
export const defaultPackageFaqs: PackageFaqItem[] = [
  {
    id: 'extra-benefits',
    question: 'ما المميزات الإضافية التي أحصل عليها مع الباقات؟',
    answer:
      'تشمل الباقات نقاطًا إعلانية وخيارات تمييز وزيادة ظهور في نتائج البحث، وفق تفاصيل كل باقة معروضة في الصفحة.',
  },
  {
    id: 'service-validity',
    question: 'ما مدة صلاحية الخدمات داخل الباقة؟',
    answer:
      'تختلف مدة صلاحية الخدمات حسب نوع الخدمة والباقة المختارة. راجع جدول المميزات في بطاقة الباقة قبل الاشتراك.',
  },
  {
    id: 'package-validity',
    question: 'ما مدة صلاحية الباقة والنقاط؟',
    answer:
      'تُعرض مدة صلاحية النقاط والخدمات داخل مواصفات كل باقة. بعد انتهاء المدة قد تحتاج لتجديد أو اختيار باقة جديدة.',
  },
  {
    id: 'digital-app',
    question: 'هل تشمل الباقة مميزات رقمية عبر التطبيق؟',
    answer:
      'قد تتضمن بعض الباقات أدوات رقمية لمتابعة الإعلانات والأداء عبر المنصة والتطبيق، حسب ما هو مذكور في مواصفات الباقة.',
  },
];

/** Shared demo terms — original concise legal-style copy for display only. */
export const defaultPackageTerms: PackageTermsContent = {
  intro:
    'باستخدام باقات الإعلان على عقارات مصر، فإنك توافق على الشروط التالية الخاصة بتفعيل الباقة واستخدام الخدمات الإعلانية.',
  bullets: [
    'يتم تفعيل الباقة بعد إتمام عملية الشراء/الاشتراك وفق آلية الدفع المتاحة في المنصة.',
    'تُحسب صلاحية الباقة والنقاط من تاريخ التفعيل وفق المدة المذكورة في مواصفات الباقة.',
    'قد تُطبق رسوم تفعيل أو شروط إضافية على بعض الباقات، ويتم عرضها بوضوح قبل التأكيد.',
    'توفر الخدمات الإعلانية خاضع لتوفرها التشغيلي ولا يضمن نتائج بيع أو تأجير محددة.',
    'المميزات المدرجة في كل باقة مرتبطة بالخطة المختارة وقد تختلف بين أنواع الحسابات.',
    'في وضع العرض الحالي لا يتم خصم مدفوعات حقيقية؛ سياسات الإلغاء والاسترداد التجريبية للتوضيح فقط.',
  ],
  disclaimer: 'هذه الشروط توضيحية لأغراض العرض فقط.',
};

export function resolvePackageFaqs(
  override?: PackageFaqItem[],
): PackageFaqItem[] {
  return override?.length ? override : defaultPackageFaqs;
}

export function resolvePackageTerms(
  override?: PackageTermsContent,
): PackageTermsContent {
  return override ?? defaultPackageTerms;
}
