import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MockPaymentProvider } from './providers/mock-payment.provider';
import { PAYMENT_PROVIDER } from './providers/payment-provider.interface';

@Module({
  controllers: [PaymentsController],
  providers: [
    MockPaymentProvider,
    {
      provide: PAYMENT_PROVIDER,
      useExisting: MockPaymentProvider,
    },
    PaymentsService,
  ],
  exports: [PaymentsService, PAYMENT_PROVIDER],
})
export class PaymentsModule {}
