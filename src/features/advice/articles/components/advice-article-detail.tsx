import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { formatDate } from '@/lib/formatting/date';
import { adviceArticleCopy } from '../config';
import type { AdviceArticleDetailsView } from '../types';
import { AdviceArticleCard } from './advice-article-card';

interface AdviceArticleDetailsPageProps {
  view: AdviceArticleDetailsView;
}

export function AdviceArticleDetailsPage({ view }: AdviceArticleDetailsPageProps) {
  const { article, related } = view;

  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: adviceArticleCopy.breadcrumbHome, href: routes.home },
            { label: adviceArticleCopy.breadcrumbKnow, href: routes.advice.root },
            { label: adviceArticleCopy.breadcrumbAdvice, href: routes.advice.index.root },
            {
              label: article.title,
              href: routes.advice.index.article(article.slug),
            },
          ]}
        />

        <article className="mx-auto mt-6 max-w-3xl">
          <p className="text-sm font-semibold text-brand-700">{article.category.nameAr}</p>
          <h1 className="mt-2 text-2xl font-extrabold leading-snug text-ink-950 sm:text-[1.85rem]">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-ink-500">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.authorLabel ? (
              <>
                <span aria-hidden> · </span>
                <span>{article.authorLabel}</span>
              </>
            ) : null}
          </p>

          <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-surface-100">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p className="mt-6 text-[15px] leading-8 text-ink-700">{article.excerpt}</p>

          <div className="mt-6 space-y-8">
            {(article.body ?? []).map((section) => (
              <section key={section.id}>
                {section.heading ? (
                  <h2 className="text-lg font-extrabold text-ink-950">{section.heading}</h2>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-[15px] leading-8 text-ink-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>

        {related.length > 0 ? (
          <section className="mt-12" aria-labelledby="related-articles-heading">
            <h2
              id="related-articles-heading"
              className="text-xl font-extrabold text-ink-950"
            >
              {adviceArticleCopy.relatedHeading}
            </h2>
            <div className="mt-2">
              {related.map((item) => (
                <AdviceArticleCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-10">
          <Link
            href={routes.advice.index.root}
            className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {adviceArticleCopy.backToIndex}
          </Link>
        </p>
      </Container>
    </div>
  );
}
