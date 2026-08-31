import { getPaymentDetails, getPayments } from './repository';
import type { AdminPayment, PaymentFilters, PaymentListResult } from './types';

export async function getAdminPayments(
  filters: PaymentFilters = {},
): Promise<PaymentListResult> {
  return getPayments({
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    status: filters.status,
  });
}

export async function getAdminPaymentDetails(id: string): Promise<AdminPayment> {
  return getPaymentDetails(id);
}
