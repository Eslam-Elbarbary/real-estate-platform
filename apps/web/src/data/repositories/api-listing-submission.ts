import 'server-only';

import {
  getJson,
  getPublicJson,
  postAuthedJson,
} from '@/lib/api/client';
import type {
  ListingPaymentDto,
  ListingPlanDto,
  ListingSubscriptionDto,
  PropertyCompletionDto,
} from '@/types/api/listing-submission';
import type { MyPropertyDto } from '@/types/api/my-property';

const ME_PATH = '/api/v1/properties/me';
const PLANS_PATH = '/api/v1/plans';
const SUBSCRIPTIONS_PATH = '/api/v1/subscriptions';

export async function fetchPropertyCompletion(
  accessToken: string,
  propertyId: string,
): Promise<PropertyCompletionDto> {
  return getJson<PropertyCompletionDto>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/completion`,
    accessToken,
  );
}

export async function fetchActivePlans(): Promise<ListingPlanDto[]> {
  const data = await getPublicJson<ListingPlanDto[]>(PLANS_PATH);
  return Array.isArray(data) ? data : [];
}

export async function createPropertySubscription(
  accessToken: string,
  propertyId: string,
  planId: string,
): Promise<ListingSubscriptionDto> {
  return postAuthedJson<ListingSubscriptionDto, { planId: string }>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/subscription`,
    { planId },
    accessToken,
  );
}

export async function fetchPropertySubscription(
  accessToken: string,
  propertyId: string,
): Promise<ListingSubscriptionDto> {
  return getJson<ListingSubscriptionDto>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/subscription`,
    accessToken,
  );
}

export async function paySubscription(
  accessToken: string,
  subscriptionId: string,
): Promise<ListingPaymentDto> {
  return postAuthedJson<ListingPaymentDto, Record<string, never>>(
    `${SUBSCRIPTIONS_PATH}/${encodeURIComponent(subscriptionId)}/pay`,
    {},
    accessToken,
  );
}

/** REJECTED → PENDING_REVIEW only. */
export async function resubmitProperty(
  accessToken: string,
  propertyId: string,
): Promise<MyPropertyDto> {
  return postAuthedJson<MyPropertyDto, Record<string, never>>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/submit`,
    {},
    accessToken,
  );
}
