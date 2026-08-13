import { AdviceArticleCard } from './advice-article-card';
import { adviceArticleCopy } from '../config';
import type { AdviceArticle } from '../types';

interface AdviceArticleListProps {
  articles: AdviceArticle[];
}

export function AdviceArticleList({ articles }: AdviceArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="border border-dashed border-[#ececec] px-4 py-10 text-center">
        <p className="font-bold text-ink-900">{adviceArticleCopy.emptyTitle}</p>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          {adviceArticleCopy.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <AdviceArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
