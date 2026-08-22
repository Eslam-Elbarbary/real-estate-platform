import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  AdviceArticlePage,
  getAdviceArticleService,
  parseAdviceArticleSearchParams,
} from '@/features/advice/articles';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const filters = parseAdviceArticleSearchParams(await searchParams);
  return createPageMetadata(
    getAdviceArticleService().buildListingMetadata(filters),
  );
}

export default async function AdviceIndexPage({ searchParams }: PageProps) {
  const filters = parseAdviceArticleSearchParams(await searchParams);
  const service = getAdviceArticleService();
  const [result, categories] = await Promise.all([
    service.listArticles(filters),
    Promise.resolve(service.getCategories()),
  ]);

  return <AdviceArticlePage result={result} categories={categories} />;
}
