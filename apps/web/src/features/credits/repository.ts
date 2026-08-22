import type { CreditAccount, CreditTransaction } from './types';

/** Deterministic fictional demo credit ledger — not real money. */
const DEMO_CREDIT_ACCOUNT: CreditAccount = {
  accountNumber: '#1000001',
  balancePoints: 0,
};

export interface CreditRepository {
  getAccount(userId: string): Promise<CreditAccount>;
  getTransactions(userId: string): Promise<CreditTransaction[]>;
}

export class MockCreditRepository implements CreditRepository {
  async getAccount(_userId: string): Promise<CreditAccount> {
    void _userId;
    return DEMO_CREDIT_ACCOUNT;
  }

  async getTransactions(_userId: string): Promise<CreditTransaction[]> {
    void _userId;
    return [];
  }
}

let creditRepository: CreditRepository | null = null;

export function getCreditRepository(): CreditRepository {
  if (!creditRepository) {
    creditRepository = new MockCreditRepository();
  }
  return creditRepository;
}
