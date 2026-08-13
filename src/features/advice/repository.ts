import { cookies } from 'next/headers';
import type { AuthUser } from '@/features/auth/types';
import {
  ADVICE_MAX_USER_ANSWERS,
  ADVICE_MAX_USER_QUESTIONS,
} from './config';
import { SEED_ANSWERS, SEED_QUESTIONS } from './data/seed';
import { fingerprintText, slugifyAdviceTitle } from './lib/slug';
import type {
  AdviceAnswer,
  AdviceAuthor,
  AdviceQuestion,
  AdviceQuestionFilters,
  CreateAdviceAnswerInput,
  CreateAdviceQuestionInput,
} from './types';

export const ADVICE_STORE_COOKIE = 'demo_advice';
const COOKIE_MAX_CHARS = 3500;

interface AdviceStore {
  questions: AdviceQuestion[];
  answers: AdviceAnswer[];
}

export interface AdviceRepository {
  getQuestions(filters: AdviceQuestionFilters): Promise<AdviceQuestion[]>;
  getQuestionById(id: string): Promise<AdviceQuestion | null>;
  getQuestionBySlug(id: string, slug: string): Promise<AdviceQuestion | null>;
  createQuestion(
    input: CreateAdviceQuestionInput & {
      locationLabel: string;
      categoryLabel: string;
    },
    author: AdviceAuthor,
  ): Promise<AdviceQuestion>;
  addAnswer(
    questionId: string,
    input: CreateAdviceAnswerInput,
    author: AdviceAuthor,
  ): Promise<AdviceAnswer>;
  getPopularQuestions(): Promise<AdviceQuestion[]>;
  getUnansweredQuestions(): Promise<AdviceQuestion[]>;
}

function parseStore(raw: string | undefined): AdviceStore {
  if (!raw) return { questions: [], answers: [] };
  try {
    const parsed = JSON.parse(raw) as AdviceStore;
    return {
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      answers: Array.isArray(parsed.answers) ? parsed.answers : [],
    };
  } catch {
    return { questions: [], answers: [] };
  }
}

function compactQuestion(question: AdviceQuestion): AdviceQuestion {
  const { answers: _answers, ...rest } = question;
  void _answers;
  return rest;
}

function sortQuestions(
  items: AdviceQuestion[],
  view: AdviceQuestionFilters['view'],
): AdviceQuestion[] {
  const copy = [...items];
  if (view === 'all') {
    copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return copy;
  }
  copy.sort((a, b) => {
    if (b.answerCount !== a.answerCount) return b.answerCount - a.answerCount;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
  return copy;
}

function applyFilters(
  items: AdviceQuestion[],
  filters: AdviceQuestionFilters,
): AdviceQuestion[] {
  return items.filter((item) => {
    if (item.status !== 'published') return false;
    if (filters.locationId && item.locationId !== filters.locationId) return false;
    if (filters.categoryId && item.categoryId !== filters.categoryId) return false;
    if (filters.view === 'unanswered' && item.answerCount !== 0) return false;
    return true;
  });
}

export function mapAuthUserToAdviceAuthor(user: AuthUser): AdviceAuthor {
  return {
    id: user.id,
    displayName: user.name,
    roleLabel: user.displayRoleLabel,
    avatarUrl: user.avatarUrl,
    isVerified: user.phoneVerified,
  };
}

export class CookieAdviceRepository implements AdviceRepository {
  private async readStore(): Promise<AdviceStore> {
    const jar = await cookies();
    const raw = jar.get(ADVICE_STORE_COOKIE)?.value;
    if (!raw) return { questions: [], answers: [] };
    try {
      return parseStore(decodeURIComponent(raw));
    } catch {
      return parseStore(raw);
    }
  }

  private async writeStore(store: AdviceStore): Promise<void> {
    const compact: AdviceStore = {
      questions: store.questions.slice(0, ADVICE_MAX_USER_QUESTIONS).map(compactQuestion),
      answers: store.answers.slice(0, ADVICE_MAX_USER_ANSWERS),
    };
    const payload = JSON.stringify(compact);
    if (payload.length > COOKIE_MAX_CHARS) {
      throw new Error('DEMO_STORE_LIMIT');
    }
    const jar = await cookies();
    jar.set(ADVICE_STORE_COOKIE, payload, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  private async mergedQuestions(): Promise<AdviceQuestion[]> {
    const store = await this.readStore();
    const byId = new Map<string, AdviceQuestion>();
    for (const item of SEED_QUESTIONS) byId.set(item.id, { ...item });
    for (const item of store.questions) byId.set(item.id, { ...item });

    const answersByQuestion = new Map<string, AdviceAnswer[]>();
    for (const answer of [...SEED_ANSWERS, ...store.answers]) {
      const list = answersByQuestion.get(answer.questionId) ?? [];
      list.push(answer);
      answersByQuestion.set(answer.questionId, list);
    }

    return [...byId.values()].map((question) => {
      const answers = answersByQuestion.get(question.id) ?? [];
      return {
        ...question,
        answers,
        answerCount: Math.max(question.answerCount, answers.length),
      };
    });
  }

  async getQuestions(filters: AdviceQuestionFilters): Promise<AdviceQuestion[]> {
    const merged = await this.mergedQuestions();
    return sortQuestions(applyFilters(merged, filters), filters.view);
  }

  async getQuestionById(id: string): Promise<AdviceQuestion | null> {
    const merged = await this.mergedQuestions();
    return merged.find((item) => item.id === id) ?? null;
  }

  async getQuestionBySlug(id: string, slug: string): Promise<AdviceQuestion | null> {
    const question = await this.getQuestionById(id);
    if (!question || question.slug !== slug) return null;
    return question;
  }

  async createQuestion(
    input: CreateAdviceQuestionInput & {
      locationLabel: string;
      categoryLabel: string;
    },
    author: AdviceAuthor,
  ): Promise<AdviceQuestion> {
    const store = await this.readStore();
    if (store.questions.length >= ADVICE_MAX_USER_QUESTIONS) {
      throw new Error('DEMO_QUESTION_LIMIT');
    }

    const slug = slugifyAdviceTitle(input.question);
    const id = `q-u-${fingerprintText(`${input.question}|${input.locationId}|${store.questions.length}`)}`;
    const createdAt = new Date().toISOString();
    const question: AdviceQuestion = {
      id,
      slug,
      title: input.question,
      locationId: input.locationId,
      locationLabel: input.locationLabel,
      categoryId: input.categoryId,
      categoryLabel: input.categoryLabel,
      author,
      answerCount: 0,
      answers: [],
      createdAt,
      status: 'published',
      isUserCreated: true,
    };

    await this.writeStore({
      questions: [compactQuestion(question), ...store.questions],
      answers: store.answers,
    });
    return question;
  }

  async addAnswer(
    questionId: string,
    input: CreateAdviceAnswerInput,
    author: AdviceAuthor,
  ): Promise<AdviceAnswer> {
    const question = await this.getQuestionById(questionId);
    if (!question) throw new Error('QUESTION_NOT_FOUND');

    const store = await this.readStore();
    if (store.answers.length >= ADVICE_MAX_USER_ANSWERS) {
      throw new Error('DEMO_ANSWER_LIMIT');
    }

    const createdAt = new Date().toISOString();
    const answer: AdviceAnswer = {
      id: `a-u-${fingerprintText(`${questionId}|${input.body}|${store.answers.length}`)}`,
      questionId,
      body: input.body,
      author,
      createdAt,
      isUserCreated: true,
    };

    await this.writeStore({
      questions: store.questions,
      answers: [answer, ...store.answers],
    });
    return answer;
  }

  async getPopularQuestions(): Promise<AdviceQuestion[]> {
    return this.getQuestions({
      view: 'popular',
      page: 1,
      transaction: 'sale',
    });
  }

  async getUnansweredQuestions(): Promise<AdviceQuestion[]> {
    return this.getQuestions({
      view: 'unanswered',
      page: 1,
      transaction: 'sale',
    });
  }
}

let adviceRepository: AdviceRepository | null = null;

export function getAdviceRepository(): AdviceRepository {
  if (!adviceRepository) adviceRepository = new CookieAdviceRepository();
  return adviceRepository;
}
