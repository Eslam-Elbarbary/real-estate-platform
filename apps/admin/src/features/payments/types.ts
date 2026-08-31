export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentProvider = 'MOCK' | 'PAYMOB' | 'STRIPE';

export interface AdminPaymentPlan {
  id: string;
  name: string;
}

export interface AdminPaymentProperty {
  id: string;
  title: string | null;
}

export interface AdminPaymentOwner {
  id: string;
  name: string | null;
  email: string;
}

export interface AdminPaymentSubscription {
  id: string;
  plan: AdminPaymentPlan;
  property: AdminPaymentProperty;
  owner: AdminPaymentOwner;
}

/** Matches NestJS AdminPaymentDto. */
export interface AdminPayment {
  id: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  providerRef: string | null;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  subscription: AdminPaymentSubscription;
}

export interface PaymentFilters {
  search?: string;
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}

export interface PaymentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentListResult {
  items: AdminPayment[];
  meta: PaymentPaginationMeta;
}
