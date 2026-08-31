import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ListAdminPaymentsQueryDto } from './dto/list-admin-payments-query.dto';
import {
  ADMIN_PAYMENT_INCLUDE,
  AdminPaymentDto,
  AdminPaymentSource,
  toAdminPayment,
} from './mapper/admin-payment.mapper';

@Injectable()
export class AdminPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPayments(query: ListAdminPaymentsQueryDto): Promise<{
    data: AdminPaymentDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [total, rows] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        include: ADMIN_PAYMENT_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) => toAdminPayment(row as AdminPaymentSource)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getPaymentDetails(paymentId: string): Promise<AdminPaymentDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: ADMIN_PAYMENT_INCLUDE,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return toAdminPayment(payment as AdminPaymentSource);
  }

  private buildWhere(query: ListAdminPaymentsQueryDto): Prisma.PaymentWhereInput {
    const where: Prisma.PaymentWhereInput = {};

    if (query.status) {
      where.status = query.status as PaymentStatus;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { providerRef: { contains: term, mode: 'insensitive' } },
        {
          subscription: {
            property: {
              title: { contains: term, mode: 'insensitive' },
            },
          },
        },
        {
          subscription: {
            property: {
              owner: {
                email: { contains: term, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    return where;
  }
}
