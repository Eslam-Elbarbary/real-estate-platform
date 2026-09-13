import { PaymentProvider as PaymentProviderEnum, Prisma } from '@/prisma/generated/prisma-client';

export type ChargePaymentInput = {
  subscriptionId: string;
  amount: Prisma.Decimal | number;
  currency?: string;
  metadata?: Prisma.InputJsonObject;
};

export type ChargePaymentResult = {
  success: boolean;
  provider: PaymentProviderEnum;
  providerRef: string;
  metadata?: Prisma.InputJsonObject;
  failureReason?: string;
};

/**
 * Abstraction over payment gateways.
 * Controllers/services depend on this interface — never on a concrete provider.
 */
export interface PaymentProvider {
  readonly name: string;
  charge(input: ChargePaymentInput): Promise<ChargePaymentResult>;
}

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');
