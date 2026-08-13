import { adviceArticleSeed } from './data/seed';
import type { AdviceArticle } from './types';

export interface AdviceArticleRepository {
  getArticles(): Promise<AdviceArticle[]>;
  getArticleBySlug(slug: string): Promise<AdviceArticle | null>;
  getFeaturedArticles(): Promise<AdviceArticle[]>;
  getCategories(): Promise<AdviceArticle['category'][]>;
}

export class MockAdviceArticleRepository implements AdviceArticleRepository {
  async getArticles(): Promise<AdviceArticle[]> {
    return [...adviceArticleSeed].sort((left, right) =>
      right.publishedAt.localeCompare(left.publishedAt),
    );
  }

  async getArticleBySlug(slug: string): Promise<AdviceArticle | null> {
    return adviceArticleSeed.find((item) => item.slug === slug) ?? null;
  }

  async getFeaturedArticles(): Promise<AdviceArticle[]> {
    return adviceArticleSeed.filter((item) => item.featured).slice(0, 3);
  }

  async getCategories(): Promise<AdviceArticle['category'][]> {
    const unique = new Map<string, AdviceArticle['category']>();
    for (const article of adviceArticleSeed) {
      unique.set(article.category.id, article.category);
    }
    return [...unique.values()];
  }
}

let repository: AdviceArticleRepository | undefined;

export function getAdviceArticleRepository(): AdviceArticleRepository {
  repository ??= new MockAdviceArticleRepository();
  return repository;
}
