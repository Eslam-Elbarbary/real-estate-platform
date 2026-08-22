import { getCreditRepository } from './repository';
import type { CreditAccount, CreditTransaction } from './types';

export class CreditService {
  constructor(private readonly repository = getCreditRepository()) {}

  getAccount(userId: string): Promise<CreditAccount> {
    return this.repository.getAccount(userId);
  }

  getTransactions(userId: string): Promise<CreditTransaction[]> {
    return this.repository.getTransactions(userId);
  }
}

let creditService: CreditService | null = null;

export function getCreditService(): CreditService {
  if (!creditService) {
    creditService = new CreditService();
  }
  return creditService;
}
