import { UserDetails } from '@/features/users/components/user-details';
import { getAdminUserDetails } from '@/features/users';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تفاصيل المستخدم',
  description: 'عرض وإدارة حساب المستخدم.',
  path: '/users',
});

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, session] = await Promise.all([
    getAdminUserDetails(id),
    getAdminSession(),
  ]);
  const roles = session?.user.roles ?? [];

  return <UserDetails user={user} roles={roles} />;
}
