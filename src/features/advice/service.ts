import { routes } from '@/config/routes';
import { getLocationRepository } from '@/data/repositories';
import { getNeighborhoodRepository } from '@/features/neighborhoods';
import { searchProperties } from '@/features/properties';
import { siteConfig } from '@/config/site';
import type { Property, TransactionType } from '@/types';
import type { NeighborhoodPropertyLink } from '@/features/neighborhoods/types';
import { ADVICE_PAGE_SIZE, adviceCopy, getAdviceCategory } from './config';
import {
  getAdviceRepository,
  mapAuthUserToAdviceAuthor,
  type AdviceRepository,
} from './repository';
import type { AuthUser } from '@/features/auth/types';
import type {
  AdviceAuthor,
  AdviceDirectoryView,
  AdviceQuestion,
  AdviceQuestionDetailsView,
  AdviceQuestionFilters,
  AdviceQuestionListResult,
  CreateAdviceAnswerInput,
  CreateAdviceQuestionInput,
} from './types';

function decodeSlug(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export class AdviceService {
  constructor(private readonly repository: AdviceRepository = getAdviceRepository()) {}

  async listQuestions(
    filters: AdviceQuestionFilters,
  ): Promise<AdviceQuestionListResult> {
    const items = await this.repository.getQuestions(filters);
    const pageSize = ADVICE_PAGE_SIZE;
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * pageSize;

    return {
      items: items.slice(start, start + pageSize).map(withoutAnswers),
      total,
      page,
      pageSize,
      totalPages,
      filters: { ...filters, page },
    };
  }

  async getDirectory(filters: AdviceQuestionFilters): Promise<AdviceDirectoryView> {
    const result = await this.listQuestions(filters);
    const [relatedProperties, cityLinks] = await Promise.all([
      this.getRelatedProperties(filters.locationId, 3),
      this.getCityPropertyLinks(filters.transaction),
    ]);

    return { result, relatedProperties, cityLinks };
  }

  async getQuestionById(id: string): Promise<AdviceQuestion | null> {
    return this.repository.getQuestionById(id);
  }

  async getQuestionDetails(
    id: string,
    slug: string,
    transaction: TransactionType = 'sale',
  ): Promise<
    | { status: 'missing' }
    | { status: 'redirect'; question: AdviceQuestion }
    | { status: 'ok'; view: AdviceQuestionDetailsView }
  > {
    const question = await this.repository.getQuestionById(id);
    if (!question) return { status: 'missing' };
    if (decodeSlug(question.slug) !== decodeSlug(slug)) {
      return { status: 'redirect', question };
    }

    const answers = [...(question.answers ?? [])].sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
    const [relatedQuestions, relatedProperties, cityLinks] = await Promise.all([
      this.getRelatedQuestions(question),
      this.getRelatedProperties(question.locationId, 3),
      this.getCityPropertyLinks(transaction),
    ]);

    return {
      status: 'ok',
      view: {
        question: { ...question, answers },
        answers,
        relatedQuestions,
        relatedProperties,
        cityLinks,
      },
    };
  }

  async createQuestion(input: CreateAdviceQuestionInput, author: AdviceAuthor) {
    const locations = await getLocationRepository().findAll();
    const location = locations.find((item) => item.id === input.locationId);
    if (!location) {
      throw new Error('INVALID_LOCATION');
    }
    const category = getAdviceCategory(input.categoryId);
    if (!category) {
      throw new Error('INVALID_CATEGORY');
    }

    return this.repository.createQuestion(
      {
        ...input,
        locationLabel: location.name,
        categoryLabel: category.nameAr,
      },
      author,
    );
  }

  async addAnswer(
    questionId: string,
    input: CreateAdviceAnswerInput,
    author: AdviceAuthor,
  ) {
    return this.repository.addAnswer(questionId, input, author);
  }

  async getRelatedProperties(locationId: string | undefined, limit: number) {
    const locations = await getLocationRepository().findAll();
    const location = locationId
      ? locations.find((item) => item.id === locationId)
      : undefined;

    const matched = location
      ? await searchProperties({
          locationSlugs: [location.slug],
          pageSize: limit,
          page: 1,
        })
      : { items: [] as Property[] };

    if (matched.items.length >= limit) {
      return matched.items.slice(0, limit);
    }

    const fallback = await searchProperties({ pageSize: limit, page: 1 });
    const seen = new Set(matched.items.map((item) => item.id));
    const extras = fallback.items.filter((item) => !seen.has(item.id));
    return [...matched.items, ...extras].slice(0, limit);
  }

  async getCityPropertyLinks(
    transaction: TransactionType,
  ): Promise<NeighborhoodPropertyLink[]> {
    const popular = await getNeighborhoodRepository().getPopular();
    return popular.map((neighborhood) => {
      const match = (neighborhood.relatedPropertyLinks ?? []).find(
        (link) => link.transaction === transaction,
      );
      return {
        label: neighborhood.nameAr,
        transaction,
        href: match?.href ?? routes.properties.root(transaction),
        count: match?.count,
      };
    });
  }

  async getRelatedQuestions(question: AdviceQuestion): Promise<AdviceQuestion[]> {
    const items = await this.repository.getQuestions({
      locationId: question.locationId,
      view: 'all',
      page: 1,
      transaction: 'sale',
    });
    return items
      .filter((item) => item.id !== question.id)
      .slice(0, 4)
      .map(withoutAnswers);
  }

  buildDirectoryMetadata() {
    return {
      title: adviceCopy.seoDirectoryTitle,
      description: adviceCopy.seoDirectoryDescription,
      path: routes.advice.ask.root,
    };
  }

  buildQuestionMetadata(question: AdviceQuestion) {
    return {
      title: question.title,
      description:
        question.body ??
        `${question.title} — سؤال لأهل ${question.locationLabel} على ${siteConfig.name}.`,
      path: routes.advice.ask.question(question.id, question.slug),
      type: 'article' as const,
    };
  }
}

function withoutAnswers(question: AdviceQuestion): AdviceQuestion {
  const { answers: _answers, ...rest } = question;
  void _answers;
  return rest;
}

export function authorFromAuthUser(user: AuthUser): AdviceAuthor {
  return mapAuthUserToAdviceAuthor(user);
}

let adviceService: AdviceService | null = null;

export function getAdviceService(): AdviceService {
  if (!adviceService) adviceService = new AdviceService();
  return adviceService;
}
