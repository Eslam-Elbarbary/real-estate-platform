export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  categoryName: string;
  coverImageUrl: string;
  authorName: string;
  publishedAt: string;
  readingMinutes: number;
}
