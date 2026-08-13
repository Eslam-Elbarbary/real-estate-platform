import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { adviceArticleCopy } from '../config';
import type { AdviceArticleCategory, AdviceArticleListResult } from '../types';
import { AdviceArticleList } from './advice-article-list';
import { AdviceArticlePagination } from './advice-article-pagination';
import {
  AdviceCategoryFilter,
  AdviceTagCloud,
} from './advice-category-filter';
import { AdviceFeaturedGrid } from './advice-featured-grid';

interface AdviceArticlePageProps {
  result: AdviceArticleListResult;
  categories: AdviceArticleCategory[];
}

export function AdviceArticlePage({ result, categories }: AdviceArticlePageProps) {
  const tags = [...new Set(result.items.flatMap((item) => item.tags))].slice(0, 8);

  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: adviceArticleCopy.breadcrumbHome, href: routes.home },
            { label: adviceArticleCopy.breadcrumbKnow, href: routes.advice.root },
            { label: adviceArticleCopy.breadcrumbAdvice, href: routes.advice.index.root },
          ]}
        />

        <header className="mt-6">
          <h1 className="text-2xl font-extrabold text-ink-950">
            {adviceArticleCopy.listingTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">
            {adviceArticleCopy.listingIntro}
          </p>
        </header>

        {result.featured.length > 0 ? (
          <div className="mt-7">
            <AdviceFeaturedGrid articles={result.featured} />
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start">
          <section className="order-2 lg:order-1" aria-labelledby="advice-feed-heading">
            <h2 id="advice-feed-heading" className="sr-only">
              قائمة المقالات
            </h2>
            <AdviceArticleList articles={result.items} />
            <AdviceArticlePagination
              filters={result.filters}
              page={result.page}
              totalPages={result.totalPages}
            />
          </section>

          <aside className="order-1 lg:order-2">
            <AdviceCategoryFilter
              categories={categories}
              filters={result.filters}
            />
            <AdviceTagCloud tags={tags} />
          </aside>
        </div>

        <p className="mt-10 text-xs font-semibold text-ink-400">
          {adviceArticleCopy.demoDisclaimer}
        </p>
      </Container>
    </div>
  );
}
