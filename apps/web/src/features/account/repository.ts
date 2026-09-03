import { cookies } from 'next/headers';
import { withRefreshedAccessToken } from '@/features/auth/session';
import {
  changeCurrentUserPassword,
  fetchCurrentUserProfile,
  updateCurrentUserProfile,
  type UserProfileResponse,
} from './api';
import type {
  AccountProfile,
  AccountSecuritySettings,
  AdvertisingContactPhone,
  FinancialWallet,
  FinancialWalletTransaction,
  SavedPaymentMethod,
  UserSubscription,
} from './types';

export const ACCOUNT_CONTACTS_COOKIE = 'account_contacts';
export const ACCOUNT_SUBSCRIPTION_COOKIE = 'account_subscription';

const EMPTY_WALLET: FinancialWallet = {
  id: 'wallet-empty',
  currency: 'EGP',
  balance: 0,
};

function toE164(nationalPhone: string): string {
  const digits = nationalPhone.replace(/\D/g, '');
  if (digits.startsWith('20')) return `+${digits}`;
  if (digits.startsWith('0')) return `+20${digits.slice(1)}`;
  return `+20${digits}`;
}

function displayName(profile: UserProfileResponse): string {
  const full = [profile.firstName, profile.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
  return full || profile.email;
}

export function mapUserProfile(profile: UserProfileResponse): AccountProfile {
  return {
    userId: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    name: displayName(profile),
    email: profile.email,
    phone: profile.phone?.trim() ?? '',
    avatarUrl: profile.avatarUrl,
    isEmailVerified: profile.isEmailVerified,
    roles: profile.roles ?? [],
    displayRoleLabel: profile.roles[0] ?? '',
  };
}


function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface AccountRepository {
  getProfile(): Promise<AccountProfile>;
  updateProfile(patch: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<AccountProfile>;
  changePassword(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void>;
  getSecuritySettings(): Promise<AccountSecuritySettings>;
  getPaymentMethods(): Promise<SavedPaymentMethod[]>;
  getContactPhones(): Promise<AdvertisingContactPhone[]>;
  addContactPhone(phone: string): Promise<AdvertisingContactPhone>;
  removeContactPhone(id: string): Promise<void>;
  setWhatsAppEnabled(id: string, enabled: boolean): Promise<AdvertisingContactPhone>;
  getWallet(): Promise<FinancialWallet>;
  getWalletTransactions(): Promise<FinancialWalletTransaction[]>;
  getCurrentSubscription(): Promise<UserSubscription | null>;
  setCurrentSubscription(
    subscription: UserSubscription | null,
  ): Promise<UserSubscription | null>;
}

export class AccountApiRepository implements AccountRepository {
  async getProfile(): Promise<AccountProfile> {
    const profile = await withRefreshedAccessToken(fetchCurrentUserProfile);
    return mapUserProfile(profile);
  }

  async updateProfile(patch: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<AccountProfile> {
    const profile = await withRefreshedAccessToken((accessToken) =>
      updateCurrentUserProfile(accessToken, patch),
    );
    return mapUserProfile(profile);
  }

  async changePassword(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await withRefreshedAccessToken((accessToken) =>
      changeCurrentUserPassword(accessToken, input),
    );
  }

  async getSecuritySettings(): Promise<AccountSecuritySettings> {
    const profile = await this.getProfile();
    return {
      email: profile.email,
      phone: profile.phone,
      phoneVerified: false,
      passwordMasked: '********',
    };
  }

  private async readContacts(): Promise<AdvertisingContactPhone[]> {
    const jar = await cookies();
    const raw = jar.get(ACCOUNT_CONTACTS_COOKIE)?.value;
    if (!raw) {
      const profile = await this.getProfile();
      const phone = profile.phone.trim();
      if (!phone) return [];
      return [
        {
          id: 'contact-primary',
          phone,
          e164: toE164(phone),
          whatsappEnabled: false,
        },
      ];
    }
    const parsed = parseJson<AdvertisingContactPhone[]>(raw, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  private async writeContacts(items: AdvertisingContactPhone[]): Promise<void> {
    const jar = await cookies();
    jar.set(ACCOUNT_CONTACTS_COOKIE, JSON.stringify(items), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async getPaymentMethods(): Promise<SavedPaymentMethod[]> {
    return [];
  }

  async getContactPhones(): Promise<AdvertisingContactPhone[]> {
    return this.readContacts();
  }

  async addContactPhone(phone: string): Promise<AdvertisingContactPhone> {
    const items = await this.readContacts();
    const normalized = phone.trim();
    if (items.some((item) => item.phone === normalized)) {
      throw new Error('هذا الرقم موجود بالفعل');
    }
    const entry: AdvertisingContactPhone = {
      id: `contact-${Date.now()}`,
      phone: normalized,
      e164: toE164(normalized),
      whatsappEnabled: false,
    };
    await this.writeContacts([entry, ...items]);
    return entry;
  }

  async removeContactPhone(id: string): Promise<void> {
    const items = await this.readContacts();
    await this.writeContacts(items.filter((item) => item.id !== id));
  }

  async setWhatsAppEnabled(
    id: string,
    enabled: boolean,
  ): Promise<AdvertisingContactPhone> {
    const items = await this.readContacts();
    const next = items.map((item) =>
      item.id === id ? { ...item, whatsappEnabled: enabled } : item,
    );
    const updated = next.find((item) => item.id === id);
    if (!updated) {
      throw new Error('رقم الهاتف غير موجود');
    }
    await this.writeContacts(next);
    return updated;
  }

  async getWallet(): Promise<FinancialWallet> {
    return EMPTY_WALLET;
  }

  async getWalletTransactions(): Promise<FinancialWalletTransaction[]> {
    return [];
  }

  private async writeSubscription(
    subscription: UserSubscription | null,
  ): Promise<void> {
    const jar = await cookies();
    if (!subscription) {
      jar.delete(ACCOUNT_SUBSCRIPTION_COOKIE);
      return;
    }
    jar.set(ACCOUNT_SUBSCRIPTION_COOKIE, JSON.stringify(subscription), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    const jar = await cookies();
    const raw = jar.get(ACCOUNT_SUBSCRIPTION_COOKIE)?.value;
    if (!raw) return null;
    const parsed = parseJson<UserSubscription | null>(raw, null);
    if (!parsed || typeof parsed !== 'object' || !parsed.planId) return null;
    return parsed;
  }

  async setCurrentSubscription(
    subscription: UserSubscription | null,
  ): Promise<UserSubscription | null> {
    await this.writeSubscription(subscription);
    return subscription;
  }
}

let accountRepository: AccountRepository | null = null;

export function getAccountRepository(): AccountRepository {
  if (!accountRepository) {
    accountRepository = new AccountApiRepository();
  }
  return accountRepository;
}

/** @deprecated Prefer AccountApiRepository */
export const CookieAccountRepository = AccountApiRepository;
