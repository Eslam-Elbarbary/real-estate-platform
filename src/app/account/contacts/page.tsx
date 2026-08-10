import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getAccountService } from '@/features/account/service';
import { ContactsPageClient } from '@/features/account/components/contacts-page-client';
import { accountCopy } from '@/features/account/config/account-nav';

export const metadata = createPageMetadata({
  title: accountCopy.contactsTitle,
  description: 'إدارة أرقام الهاتف الظاهرة على إعلاناتك.',
  path: routes.account.contacts,
  noIndex: true,
});

export default async function AccountContactsPage() {
  const contacts = await getAccountService().getContactPhones();
  return <ContactsPageClient contacts={contacts} />;
}
