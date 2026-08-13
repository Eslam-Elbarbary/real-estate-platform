import { routes } from '@/config/routes';
import type { PageSeoInput } from '@/lib/seo/metadata';
import {
  ADVICE_ARTICLE_PAGE_SIZE,
  adviceArticleCopy,
  adviceArticleCategories,
  getAdviceArticleCategory,
} from './config';
import {
  getAdviceArticleRepository,
  type AdviceArticleRepository,
} from './repository';
import type {
  AdviceArticle,
  AdviceArticleDetailsView,
  AdviceArticleFilters,
  AdviceArticleListResult,
} from './types';

export class AdviceArticleService {
  constructor(
    private readonly repository: AdviceArticleRepository = getAdviceArticleRepository(),
  ) {}

  async listArticles(
    filters: AdviceArticleFilters,
  ): Promise<AdviceArticleListResult> {
    const all = await this.repository.getArticles();
    const filtered = filters.categoryId
      ? all.filter((item) => item.category.id === filters.categoryId)
      : all;
    const featured = filters.categoryId
      ? []
      : (await this.repository.getFeaturedArticles()).slice(0, 3);

    const pageSize = ADVICE_ARTICLE_PAGE_SIZE;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      featured,
      total,
      page,
      pageSize,
      totalPages,
      filters: { ...filters, page },
    };
  }

  async getArticleDetails(slug: string): Promise<AdviceArticleDetailsView | null> {
    const article = await this.repository.getArticleBySlug(slug);
    if (!article) return null;

    const all = await this.repository.getArticles();
    const related = all
      .filter(
        (item) =>
          item.id !== article.id && item.category.id === article.category.id,
      )
      .slice(0, 3);

    return { article, related };
  }

  getCategories() {
    return adviceArticleCategories;
  }

  buildListingMetadata(filters: AdviceArticleFilters): PageSeoInput {
    const category = filters.categoryId
      ? getAdviceArticleCategory(filters.categoryId)
      : undefined;
    const title = category
      ? `${adviceArticleCopy.seoListingTitle} — ${category.nameAr}`
      : adviceArticleCopy.seoListingTitle;

    return {
      title,
      description: adviceArticleCopy.seoListingDescription,
      path: routes.advice.index.root,
    };
  }

  buildArticleMetadata(article: AdviceArticle): PageSeoInput {
    return {
      title: article.title,
      description: article.excerpt,
      path: routes.advice.index.article(article.slug),
      image: article.coverImage,
      type: 'article',
    };
  }
}

let service: AdviceArticleService | undefined;

export function getAdviceArticleService(): AdviceArticleService {
  service ??= new AdviceArticleService();
  return service;
}
