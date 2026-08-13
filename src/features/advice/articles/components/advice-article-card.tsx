import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatDate } from '@/lib/formatting/date';
import { adviceArticleCopy } from '../config';
import type { AdviceArticle } from '../types';

interface AdviceArticleCardProps {
  article: AdviceArticle;
}

export function AdviceArticleCard({ article }: AdviceArticleCardProps) {
  const href = routes.advice.index.article(article.slug);

  return (
    <article className="flex gap-4 border-b border-[#ececec] py-5 sm:gap-5">
      <Link
        href={href}
        className="relative h-[5.5rem] w-[7.5rem] shrink-0 overflow-hidden bg-surface-100 sm:h-[6.5rem] sm:w-[9.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover"
          sizes="152px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <h2 className="text-[15px] font-extrabold leading-7 text-ink-950 sm:text-base">
          <Link
            href={href}
            className="hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-1 text-xs text-ink-500">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden> · </span>
          <span>{article.category.nameAr}</span>
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-600">
          {article.excerpt}
        </p>
        <Link
          href={href}
          className="mt-2.5 inline-flex rounded border border-[#e4e4e4] px-2.5 py-1 text-xs font-semibold text-ink-700 hover:border-brand-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {adviceArticleCopy.readMore}
          <span className="sr-only">: {article.title}</span>
        </Link>
      </div>
    </article>
  );
}
