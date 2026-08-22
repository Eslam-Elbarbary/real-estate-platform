import Link from 'next/link';
import { routes } from '@/config/routes';
import { buildAdviceIndexPath } from '../search-params';
import { adviceArticleCopy } from '../config';
import type { AdviceArticleCategory, AdviceArticleFilters } from '../types';
import { cn } from '@/lib/utils/cn';

interface AdviceCategoryFilterProps {
  categories: AdviceArticleCategory[];
  filters: AdviceArticleFilters;
}

export function AdviceCategoryFilter({
  categories,
  filters,
}: AdviceCategoryFilterProps) {
  return (
    <nav aria-labelledby="advice-categories-heading">
      <h2
        id="advice-categories-heading"
        className="text-base font-extrabold text-ink-950"
      >
        {adviceArticleCopy.categoriesHeading}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        <li>
          <Link
            href={routes.advice.index.root}
            className={cn(
              'inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              !filters.categoryId
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-[#ececec] text-ink-700 hover:border-brand-200 hover:text-brand-700',
            )}
          >
            {adviceArticleCopy.allCategories}
          </Link>
        </li>
        {categories.map((category) => {
          const active = filters.categoryId === category.id;
          return (
            <li key={category.id}>
              <Link
                href={buildAdviceIndexPath({ categoryId: category.id })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  active
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-[#ececec] text-ink-700 hover:border-brand-200 hover:text-brand-700',
                )}
              >
                {category.nameAr}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface AdviceTagCloudProps {
  tags: string[];
}

export function AdviceTagCloud({ tags }: AdviceTagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="advice-topics-heading">
      <h2
        id="advice-topics-heading"
        className="text-base font-extrabold text-ink-950"
      >
        {adviceArticleCopy.topicsHeading}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md bg-surface-50 px-2.5 py-1 text-xs font-medium text-ink-600"
          >
            {tag}
          </li>
        ))}
      </ul>
    </section>
  );
}
