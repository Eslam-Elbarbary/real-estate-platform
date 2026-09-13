import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import type { TransactionType } from '@/types';

interface SearchErrorStateProps {
  message?: string;
  transactionType?: TransactionType;
}

export function SearchErrorState({
  message,
  transactionType = 'sale',
}: SearchErrorStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white px-6 py-14 text-center">
      <AlertTriangle className="size-10 text-danger-500" aria-hidden />
      <h2 className="mt-4 text-lg font-bold text-ink-900">
        تعذر تحميل نتائج البحث
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-600">
        {message?.trim() ||
          'حدث خطأ أثناء الاتصال بالخادم. تأكد من تشغيل الـ API ثم أعد المحاولة.'}
      </p>
      <Link
        href={routes.properties.root(transactionType)}
        className={getButtonClassName({ className: 'mt-5' })}
      >
        {uiLabels.emptyResultsReset}
      </Link>
    </div>
  );
}
