import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getCreditService } from '@/features/credits/service';
import { CreditsPage } from '@/features/credits/components/credits-page';

export const metadata = createPageMetadata({
  title: 'رصيدي',
  description: 'اطّلع على رصيد نقاطك ومعاملات الشحن الخاصة بحسابك.',
  path: routes.credits,
  noIndex: true,
});

export default async function CreditsRoutePage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.credits)}`,
    );
  }

  const service = getCreditService();
  const [account, transactions] = await Promise.all([
    service.getAccount(session.user.id),
    service.getTransactions(session.user.id),
  ]);

  return <CreditsPage account={account} transactions={transactions} />;
}
