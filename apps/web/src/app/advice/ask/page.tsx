import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getLocationOptions } from '@/features/locations';
import { getServerSession } from '@/features/auth/session';
import {
  AskAreaPage,
  getAdviceService,
  hasAdviceFlash,
  parseAdviceSearchParams,
} from '@/features/advice';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(getAdviceService().buildDirectoryMetadata());
}

export default async function AdviceAskPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseAdviceSearchParams(params);
  const [view, locations, session] = await Promise.all([
    getAdviceService().getDirectory(filters),
    getLocationOptions(),
    getServerSession(),
  ]);

  return (
    <AskAreaPage
      view={view}
      filters={filters}
      locations={locations.map((item) => ({ id: item.id, name: item.name }))}
      isAuthenticated={Boolean(session)}
      created={hasAdviceFlash(params, 'created')}
    />
  );
}
