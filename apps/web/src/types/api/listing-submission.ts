/** Listing completion, plans, subscriptions, and payments — owner submission flow */

export interface PropertyCompletionDto {
  completed: boolean;
  progress: number;
  missingFields: string[];
}

export interface ListingPlanDto {
  id: string;
  name: string;
  code: string;
  price: number;
  durationDays: number;
  features: unknown;
  status: 'ACTIVE' | 'INACTIVE' | string;
}

export type SubscriptionNextAction = 'pay' | 'await_review';

export type ApiSubscriptionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED';

export interface ListingSubscriptionDto {
  id: string;
  plan: ListingPlanDto;
  status: ApiSubscriptionStatus;
  price: number;
  duration: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  nextAction?: SubscriptionNextAction;
}

export type ApiPaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface ListingPaymentDto {
  id: string;
  amount: number;
  provider: string;
  status: ApiPaymentStatus;
  paidAt: string | null;
  createdAt: string;
}
