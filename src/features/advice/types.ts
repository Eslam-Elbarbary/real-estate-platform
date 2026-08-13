import type { Property, TransactionType } from '@/types';
import type { NeighborhoodPropertyLink } from '@/features/neighborhoods/types';

export type AdviceQuestionStatus = 'published' | 'pending';

export type AdviceQuestionView = 'popular' | 'unanswered' | 'all';

export interface AdviceAuthor {
  id: string;
  displayName: string;
  roleLabel?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface AdviceCategory {
  id: string;
  slug: string;
  nameAr: string;
}

export interface AdviceAnswer {
  id: string;
  questionId: string;
  body: string;
  author: AdviceAuthor;
  createdAt: string;
  helpfulCount?: number;
  isUserCreated?: boolean;
}

export interface AdviceQuestion {
  id: string;
  slug: string;
  title: string;
  body?: string;
  locationId: string;
  locationLabel: string;
  categoryId: string;
  categoryLabel: string;
  author: AdviceAuthor;
  answerCount: number;
  answers?: AdviceAnswer[];
  createdAt: string;
  status: AdviceQuestionStatus;
  isUserCreated?: boolean;
}

export interface AdviceQuestionFilters {
  locationId?: string;
  categoryId?: string;
  view: AdviceQuestionView;
  page: number;
  transaction: TransactionType;
}

export interface AdviceQuestionListResult {
  items: AdviceQuestion[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: AdviceQuestionFilters;
}

export interface AdviceDirectoryView {
  result: AdviceQuestionListResult;
  relatedProperties: Property[];
  cityLinks: NeighborhoodPropertyLink[];
}

export interface AdviceQuestionDetailsView {
  question: AdviceQuestion;
  answers: AdviceAnswer[];
  relatedQuestions: AdviceQuestion[];
  relatedProperties: Property[];
  cityLinks: NeighborhoodPropertyLink[];
}

export interface CreateAdviceQuestionInput {
  locationId: string;
  categoryId: string;
  question: string;
}

export interface CreateAdviceAnswerInput {
  body: string;
}
