import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';

export default function AccountIndexPage() {
  redirect(routes.account.profile);
}
