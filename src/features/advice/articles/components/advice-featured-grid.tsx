import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { AdviceArticle } from '../types';

interface AdviceFeaturedGridProps {
  articles: AdviceArticle[];
}

export function AdviceFeaturedGrid({ articles }: AdviceFeaturedGridProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="advice-featured-heading">
      <h2 id="advice-featured-heading" className="sr-only">
        مختارات تحريرية
      </h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={routes.advice.index.article(article.slug)}
              className="group relative block aspect-[16/10] overflow-hidden bg-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/25 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span className="inline-flex rounded bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                  {article.category.nameAr}
                </span>
                <span className="mt-1.5 block text-sm font-extrabold leading-6">
                  {article.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
