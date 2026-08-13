export interface AdviceArticleCategory {
  id: string;
  slug: string;
  nameAr: string;
}

export interface AdviceArticleSection {
  id: string;
  heading?: string;
  paragraphs: string[];
}

export interface AdviceArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: AdviceArticleCategory;
  tags: string[];
  publishedAt: string;
  authorLabel?: string;
  body?: AdviceArticleSection[];
  featured?: boolean;
}

export interface AdviceArticleFilters {
  categoryId?: string;
  page: number;
}

export interface AdviceArticleListResult {
  items: AdviceArticle[];
  featured: AdviceArticle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: AdviceArticleFilters;
}

export interface AdviceArticleDetailsView {
  article: AdviceArticle;
  related: AdviceArticle[];
}
