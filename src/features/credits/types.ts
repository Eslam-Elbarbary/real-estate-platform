/** Commercial package audience — distinct from UserRole and PropertySeller.type. */
export type CommercialAccountRole =
  | 'owner'
  | 'marketer'
  | 'marketing_company'
  | 'compound_developer';

export interface CreditAccount {
  accountNumber: string;
  balancePoints: number;
}

export type CreditTransactionType = 'credit' | 'debit';

export interface CreditTransaction {
  id: string;
  points: number;
  type: CreditTransactionType;
  description: string;
  createdAt: string;
}

export interface CreditPackageFeature {
  key: string;
  label: string;
  value?: string | number;
  included: boolean | 'na';
}

export interface CreditPackage {
  id: string;
  audience: CommercialAccountRole;
  title?: string;
  priceEgp: number;
  points?: number;
  highlighted?: boolean;
  badge?: string;
  activationFeeEgp?: number;
  features: CreditPackageFeature[];
}
