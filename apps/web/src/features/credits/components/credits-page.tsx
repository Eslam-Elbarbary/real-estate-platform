import Image from 'next/image';
import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import type { CreditAccount, CreditTransaction } from '@/features/credits/types';
import { cn } from '@/lib/utils/cn';

const creditsCopy = {
  title: 'رصيدي',
  accountNumberPrefix: 'رقم حسابك:',
  currentBalancePrefix: 'رصيدك الحالي:',
  pointsUnit: 'نقطة',
  recharge: 'اشحن رصيدك',
  pointsColumn: 'النقاط',
  descriptionColumn: 'الوصف',
  dateColumn: 'التاريخ',
  emptyTransactions:
    'لا توجد لديك أي عمليات دفع حتى الآن، يرجى الضغط على زر شحن رصيدك لتتمكن من الإعلان عن عقاراتك في المناطق المدفوعة.',
} as const;

interface CreditsPageProps {
  account: CreditAccount;
  transactions: CreditTransaction[];
}

export function CreditsPage({ account, transactions }: CreditsPageProps) {
  return (
    <div className="bg-white pb-16">
      <div className="border-b border-border bg-brand-700">
        <Container className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <div className="max-w-xl text-white">
            <h2 className="text-2xl font-extrabold sm:text-3xl">دليل الكمبوند</h2>
            <p className="mt-2 text-sm leading-7 text-white/85">
              استكشف المشاريع وقارن الوحدات والأسعار قبل اتخاذ قرار الشراء.
            </p>
          </div>
          <div className="relative h-36 w-28 shrink-0 sm:h-40 sm:w-32">
            <Image
              src="/assets/home/know/ai-phone.webp"
              alt=""
              fill
              className="object-contain"
              sizes="128px"
              priority
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-12">
        <h1 className="text-3xl font-extrabold text-ink-950">
          {creditsCopy.title}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {creditsCopy.accountNumberPrefix}{' '}
          <span dir="ltr">{account.accountNumber}</span>
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-between gap-4 rounded-xl border border-[#e5e5e5] bg-white px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <p className="text-xl font-bold text-ink-800 sm:text-2xl">
            {creditsCopy.currentBalancePrefix}{' '}
            <span className="text-ink-400">
              {account.balancePoints} {creditsCopy.pointsUnit}
            </span>
          </p>
          <Link
            href={routes.packages.root}
            className={getButtonClassName({
              className: 'h-11 min-w-[9rem] rounded-lg px-6 font-bold',
            })}
          >
            {creditsCopy.recharge}
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-[#e5e5e5]">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 text-ink-700">
              <tr>
                <th className="px-4 py-3 text-start font-bold">
                  {creditsCopy.pointsColumn}
                </th>
                <th className="px-4 py-3 text-start font-bold">
                  {creditsCopy.descriptionColumn}
                </th>
                <th className="px-4 py-3 text-start font-bold">
                  {creditsCopy.dateColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-16 text-center text-sm leading-7 text-ink-500"
                  >
                    {creditsCopy.emptyTransactions}
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr key={item.id} className="border-t border-[#e5e5e5]">
                    <td className="px-4 py-3 font-semibold text-ink-900">
                      {item.type === 'debit' ? '-' : '+'}
                      {item.points}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{item.description}</td>
                    <td className="px-4 py-3 text-ink-500" dir="ltr">
                      {new Intl.DateTimeFormat('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }).format(new Date(item.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={routes.packages.root}
            className={cn(
              getButtonClassName({
                className: 'h-11 min-w-[10rem] rounded-lg px-8 font-bold',
              }),
            )}
          >
            {creditsCopy.recharge}
          </Link>
        </div>
      </Container>
    </div>
  );
}
