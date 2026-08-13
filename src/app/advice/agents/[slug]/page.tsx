import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { AgentProfilePage, getAgentService } from '@/features/advice/agents';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const view = await getAgentService().getProfile(slug);
  if (!view) {
    return createPageMetadata({
      title: 'الوسيط غير موجود',
      description: 'تعذر العثور على صفحة هذا الوسيط.',
      noIndex: true,
    });
  }
  return createPageMetadata(getAgentService().buildProfileMetadata(view.agent));
}

export default async function AdviceAgentProfilePage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const page = parsePage((await searchParams).page);
  const view = await getAgentService().getProfile(slug, page);
  if (!view) notFound();
  return <AgentProfilePage view={view} />;
}
