import { LeadDetails } from '@/features/leads/components/lead-details';
import { getAdminLeadDetails } from '@/features/leads';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تفاصيل الطلب',
  description: 'عرض وإدارة تفاصيل طلب التواصل.',
  path: '/leads',
});

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, session] = await Promise.all([
    getAdminLeadDetails(id),
    getAdminSession(),
  ]);
  const roles = session?.user.roles ?? [];

  return <LeadDetails lead={lead} roles={roles} />;
}
