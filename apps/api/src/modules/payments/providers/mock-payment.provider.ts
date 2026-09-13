import { Injectable } from '@nestjs/common';
import { PaymentProvider as PaymentProviderEnum } from '@/prisma/generated/prisma-client';
import { randomUUID } from 'crypto';
import {
  ChargePaymentInput,
  ChargePaymentResult,
  PaymentProvider,
} from './payment-provider.interface';

/**
 * Development/test gateway that always succeeds.
 * Swap via PAYMENT_PROVIDER token for Paymob/Stripe later.
 */
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  async charge(input: ChargePaymentInput): Promise<ChargePaymentResult> {
    return {
      success: true,
      provider: PaymentProviderEnum.MOCK,
      providerRef: `mock_${input.subscriptionId}_${randomUUID()}`,
      metadata: {
        amount: Number(input.amount),
        currency: input.currency ?? 'EGP',
        ...(input.metadata ?? {}),
      },
    };
  }
}
