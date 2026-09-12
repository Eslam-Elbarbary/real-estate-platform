import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from '@/prisma/generated/prisma-client';

export class PaymentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 499 })
  amount!: number;

  @ApiProperty({ enum: PaymentProvider })
  provider!: PaymentProvider;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiPropertyOptional({ nullable: true })
  paidAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;
}

export function toPaymentResponse(payment: Payment): PaymentResponseDto {
  return {
    id: payment.id,
    amount: Number(payment.amount),
    provider: payment.provider,
    status: payment.status,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
  };
}
