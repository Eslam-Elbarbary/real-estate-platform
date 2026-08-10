/** Account profile settings — distinct from AuthUser session identity. */
export interface AccountProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  displayRoleLabel: string;
  avatarUrl?: string;
  memberSinceLabel: string;
}

export interface AccountSecuritySettings {
  email: string;
  phone: string;
  phoneVerified: boolean;
  passwordMasked: string;
}

/** Demo-only saved card metadata — never store real PAN/CVV. */
export interface SavedPaymentMethod {
  id: string;
  nickname: string;
  brandLabel: string;
  lastFour: string;
}

/** Financial money wallet — NOT PropertyPortfolio and NOT CreditAccount. */
export interface FinancialWallet {
  id: string;
  currency: 'EGP';
  balance: number;
}

export interface FinancialWalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  currency: 'EGP';
  description: string;
  createdAt: string;
}

export interface AdvertisingContactPhone {
  id: string;
  /** National digits without country code, e.g. 01000000000 */
  phone: string;
  /** Display form, e.g. +201000000000 */
  e164: string;
  whatsappEnabled: boolean;
}

export interface SubscriptionFeature {
  id: string;
  label: string;
  included: boolean;
  value?: string | number;
}

export type SubscriptionAudience = 'general' | 'property_owner';

export type SubscriptionBillingPeriod = 'monthly' | 'quarterly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  audience: SubscriptionAudience;
  title: string;
  billingPeriod?: SubscriptionBillingPeriod;
  /** Supported billing options for checkout (general Pro). */
  billingOptions?: SubscriptionBillingPeriod[];
  durationMonths?: number;
  priceEgp: number;
  originalPriceEgp?: number;
  discountPercent?: number;
  pointsIncluded?: number;
  includesPropertyListing: boolean;
  listingExclusionWarning?: string;
  highlighted?: boolean;
  badge?: string;
  features: SubscriptionFeature[];
}

export interface UserSubscription {
  id: string;
  planId: string;
  planTitle: string;
  billingPeriod: SubscriptionBillingPeriod;
  status: 'active' | 'cancelled' | 'expired';
  priceEgp: number;
  startedAt: string;
  expiresAt: string;
  autoRenew: boolean;
}

export type AccountNavId =
  | 'profile'
  | 'security'
  | 'payment-methods'
  | 'wallet'
  | 'subscription'
  | 'contacts';
