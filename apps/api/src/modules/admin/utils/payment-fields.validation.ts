import { BadRequestException } from '@nestjs/common';
import { PaymentType } from '@prisma/client';

export type PaymentFieldsInput = {
  paymentType?: PaymentType | null;
  downPayment?: number | null;
  installmentYears?: number | null;
  monthlyInstallment?: number | null;
};

/**
 * Domain-aligned payment field checks (no invented requirements).
 * - INSTALLMENT: supplied installmentYears must be ≥ 1; monthlyInstallment > 0 when supplied
 * - CASH: installment-specific fields must not be set
 * - CASH_OR_INSTALLMENT: allow any combination of optional fields
 */
export function assertPaymentFieldsConsistency(
  input: PaymentFieldsInput,
): void {
  const paymentType = input.paymentType;

  if (paymentType === undefined) {
    return;
  }

  if (paymentType === PaymentType.CASH) {
    if (input.installmentYears != null) {
      throw new BadRequestException(
        'installmentYears is not allowed when paymentType is CASH',
      );
    }
    if (input.monthlyInstallment != null) {
      throw new BadRequestException(
        'monthlyInstallment is not allowed when paymentType is CASH',
      );
    }
    if (input.downPayment != null) {
      throw new BadRequestException(
        'downPayment is not allowed when paymentType is CASH',
      );
    }
    return;
  }

  if (paymentType === PaymentType.INSTALLMENT) {
    if (input.installmentYears != null && input.installmentYears < 1) {
      throw new BadRequestException(
        'installmentYears must be a positive integer when paymentType is INSTALLMENT',
      );
    }
    if (input.monthlyInstallment != null && input.monthlyInstallment <= 0) {
      throw new BadRequestException(
        'monthlyInstallment must be greater than 0 when provided for INSTALLMENT',
      );
    }
    if (input.downPayment != null && input.downPayment < 0) {
      throw new BadRequestException(
        'downPayment must be greater than or equal to 0 when provided',
      );
    }
  }
}
