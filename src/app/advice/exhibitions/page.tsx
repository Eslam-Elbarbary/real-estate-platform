import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  ExhibitionsPage,
  getExhibitionService,
  parseExhibitionSearchParams,
} from '@/features/advice/exhibitions';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(getExhibitionService().buildDirectoryMetadata());
}

export default async function AdviceExhibitionsPage({ searchParams }: PageProps) {
  const params = parseExhibitionSearchParams(await searchParams);
  const view = await getExhibitionService().getDirectoryView(params);
  return <ExhibitionsPage view={view} />;
}
