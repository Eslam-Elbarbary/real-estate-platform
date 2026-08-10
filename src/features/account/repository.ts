import { cookies } from 'next/headers';
import { DEMO_USER } from '@/features/auth/demo-user';
import type {
  AccountProfile,
  AccountSecuritySettings,
  AdvertisingContactPhone,
  FinancialWallet,
  FinancialWalletTransaction,
  SavedPaymentMethod,
  UserSubscription,
} from './types';

export const ACCOUNT_CONTACTS_COOKIE = 'demo_account_contacts';
export const ACCOUNT_PROFILE_COOKIE = 'demo_account_profile';
export const ACCOUNT_SUBSCRIPTION_COOKIE = 'demo_account_subscription';

const DEFAULT_WALLET: FinancialWallet = {
  id: 'wallet-demo-1',
  currency: 'EGP',
  balance: 0,
};

function toE164(nationalPhone: string): string {
  const digits = nationalPhone.replace(/\D/g, '');
  if (digits.startsWith('20')) return `+${digits}`;
  if (digits.startsWith('0')) return `+20${digits.slice(1)}`;
  return `+20${digits}`;
}

function defaultProfile(): AccountProfile {
  return {
    userId: DEMO_USER.id,
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    phone: DEMO_USER.phone,
    phoneVerified: DEMO_USER.phoneVerified ?? true,
    displayRoleLabel: DEMO_USER.displayRoleLabel ?? 'مالك عقار',
    avatarUrl: DEMO_USER.avatarUrl,
    memberSinceLabel: DEMO_USER.memberSinceLabel,
  };
}

function defaultContacts(): AdvertisingContactPhone[] {
  return [
    {
      id: 'contact-demo-1',
      phone: DEMO_USER.phone,
      e164: toE164(DEMO_USER.phone),
      whatsappEnabled: false,
    },
  ];
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
  updateProfile(patch: Partial<AccountProfile>): Promise<AccountProfile>;
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

export class CookieAccountRepository implements AccountRepository {
  private async readProfile(): Promise<AccountProfile> {
    const jar = await cookies();
    const stored = parseJson<Partial<AccountProfile> | null>(
      jar.get(ACCOUNT_PROFILE_COOKIE)?.value,
      null,
    );
    return { ...defaultProfile(), ...stored };
  }

  private async writeProfile(profile: AccountProfile): Promise<void> {
    const jar = await cookies();
    jar.set(ACCOUNT_PROFILE_COOKIE, JSON.stringify(profile), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  private async readContacts(): Promise<AdvertisingContactPhone[]> {
    const jar = await cookies();
    const raw = jar.get(ACCOUNT_CONTACTS_COOKIE)?.value;
    if (!raw) return defaultContacts();
    const parsed = parseJson<AdvertisingContactPhone[]>(raw, defaultContacts());
    return Array.isArray(parsed) ? parsed : defaultContacts();
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

  async getProfile(): Promise<AccountProfile> {
    return this.readProfile();
  }

  async updateProfile(patch: Partial<AccountProfile>): Promise<AccountProfile> {
    const next = { ...(await this.readProfile()), ...patch };
    await this.writeProfile(next);
    return next;
  }

  async getSecuritySettings(): Promise<AccountSecuritySettings> {
    const profile = await this.readProfile();
    return {
      email: profile.email,
      phone: profile.phone,
      phoneVerified: profile.phoneVerified,
      passwordMasked: '********',
    };
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
    return DEFAULT_WALLET;
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
    accountRepository = new CookieAccountRepository();
  }
  return accountRepository;
}
