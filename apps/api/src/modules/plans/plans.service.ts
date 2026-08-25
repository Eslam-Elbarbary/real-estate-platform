import { Injectable } from '@nestjs/common';
import { PlanStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { PlanResponseDto, toPlanResponse } from './mapper/plan.mapper';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive(): Promise<PlanResponseDto[]> {
    const plans = await this.prisma.plan.findMany({
      where: { status: PlanStatus.ACTIVE },
      orderBy: [{ price: 'asc' }, { name: 'asc' }],
    });

    return plans.map(toPlanResponse);
  }
}
