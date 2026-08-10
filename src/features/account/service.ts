import {
  getSubscriptionPlanById,
  resolvePlanPricing,
  subscriptionPlans,
} from '@/features/subscriptions/config';
import { getAccountRepository } from './repository';
import type {
  AccountProfile,
  AccountSecuritySettings,
  AdvertisingContactPhone,
  FinancialWallet,
  FinancialWalletTransaction,
  SavedPaymentMethod,
  SubscriptionBillingPeriod,
  SubscriptionPlan,
  UserSubscription,
} from './types';

export class AccountService {
  constructor(private readonly repository = getAccountRepository()) {}

  getProfile(): Promise<AccountProfile> {
    return this.repository.getProfile();
  }

  updateProfile(patch: Partial<AccountProfile>): Promise<AccountProfile> {
    return this.repository.updateProfile(patch);
  }

  getSecuritySettings(): Promise<AccountSecuritySettings> {
    return this.repository.getSecuritySettings();
  }

  getPaymentMethods(): Promise<SavedPaymentMethod[]> {
    return this.repository.getPaymentMethods();
  }

  getContactPhones(): Promise<AdvertisingContactPhone[]> {
    return this.repository.getContactPhones();
  }

  addContactPhone(phone: string): Promise<AdvertisingContactPhone> {
    return this.repository.addContactPhone(phone);
  }

  removeContactPhone(id: string): Promise<void> {
    return this.repository.removeContactPhone(id);
  }

  setWhatsAppEnabled(
    id: string,
    enabled: boolean,
  ): Promise<AdvertisingContactPhone> {
    return this.repository.setWhatsAppEnabled(id, enabled);
  }
}

export class WalletService {
  constructor(private readonly repository = getAccountRepository()) {}

  getWallet(): Promise<FinancialWallet> {
    return this.repository.getWallet();
  }

  getTransactions(): Promise<FinancialWalletTransaction[]> {
    return this.repository.getWalletTransactions();
  }
}

export class SubscriptionService {
  constructor(private readonly repository = getAccountRepository()) {}

  getPlans(): SubscriptionPlan[] {
    return subscriptionPlans;
  }

  getPlanById(id: string): SubscriptionPlan | null {
    return getSubscriptionPlanById(id);
  }

  getCurrentSubscription(): Promise<UserSubscription | null> {
    return this.repository.getCurrentSubscription();
  }

  async activateDemoSubscription(input: {
    userId: string;
    planId: string;
    billingPeriod: SubscriptionBillingPeriod;
  }): Promise<UserSubscription> {
    const plan = getSubscriptionPlanById(input.planId);
    if (!plan) {
      throw new Error('الخطة غير موجودة');
    }
    const pricing = resolvePlanPricing(plan, input.billingPeriod);
    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setMonth(expiresAt.getMonth() + pricing.durationMonths);

    const subscription: UserSubscription = {
      id: `sub-${input.userId}-${Date.now()}`,
      planId: plan.id,
      planTitle: pricing.title,
      billingPeriod: input.billingPeriod,
      status: 'active',
      priceEgp: pricing.priceEgp,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      autoRenew: true,
    };

    await this.repository.setCurrentSubscription(subscription);
    return subscription;
  }

  async cancelDemoSubscription(_userId: string): Promise<UserSubscription | null> {
    void _userId;
    const current = await this.repository.getCurrentSubscription();
    if (!current) return null;
    const cancelled: UserSubscription = {
      ...current,
      status: 'cancelled',
      autoRenew: false,
    };
    await this.repository.setCurrentSubscription(cancelled);
    return cancelled;
  }
}

let accountService: AccountService | null = null;
let walletService: WalletService | null = null;
let subscriptionService: SubscriptionService | null = null;

export function getAccountService(): AccountService {
  if (!accountService) accountService = new AccountService();
  return accountService;
}

export function getWalletService(): WalletService {
  if (!walletService) walletService = new WalletService();
  return walletService;
}

export function getSubscriptionService(): SubscriptionService {
  if (!subscriptionService) subscriptionService = new SubscriptionService();
  return subscriptionService;
}
