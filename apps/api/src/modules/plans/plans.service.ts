import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ListAdminPlansQueryDto } from './dto/list-admin-plans-query.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {
  AdminPlanDto,
  PlanResponseDto,
  toAdminPlan,
  toPlanResponse,
} from './mapper/plan.mapper';

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

  async listAdmin(query: ListAdminPlansQueryDto): Promise<{
    data: AdminPlanDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildAdminWhere(query);

    const [total, rows] = await Promise.all([
      this.prisma.plan.count({ where }),
      this.prisma.plan.findMany({
        where,
        include: { _count: { select: { subscriptions: true } } },
        orderBy: [{ status: 'asc' }, { price: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(toAdminPlan),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getAdminById(id: string): Promise<AdminPlanDto> {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: { _count: { select: { subscriptions: true } } },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return toAdminPlan(plan);
  }

  async createAdmin(dto: CreatePlanDto): Promise<AdminPlanDto> {
    await this.assertCodeAvailable(dto.code);
    this.validateFeatures(dto.features);

    try {
      const created = await this.prisma.plan.create({
        data: {
          code: dto.code,
          name: dto.name.trim(),
          price: dto.price,
          durationDays: dto.durationDays,
          features: (dto.features ?? {}) as Prisma.InputJsonValue,
          status: dto.status ?? PlanStatus.ACTIVE,
        },
        include: { _count: { select: { subscriptions: true } } },
      });

      return toAdminPlan(created);
    } catch (error) {
      this.rethrowUniqueCode(error);
      throw error;
    }
  }

  async updateAdmin(id: string, dto: UpdatePlanDto): Promise<AdminPlanDto> {
    const existing = await this.prisma.plan.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Plan not found');
    }

    if (dto.code && dto.code !== existing.code) {
      await this.assertCodeAvailable(dto.code, id);
    }

    if (dto.features !== undefined) {
      this.validateFeatures(dto.features);
    }

    const data: Prisma.PlanUpdateInput = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.price !== undefined) {
      data.price = dto.price;
    }
    if (dto.durationDays !== undefined) {
      data.durationDays = dto.durationDays;
    }
    if (dto.features !== undefined) {
      data.features = dto.features as Prisma.InputJsonValue;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.plan.update({
        where: { id },
        data,
        include: { _count: { select: { subscriptions: true } } },
      });

      return toAdminPlan(updated);
    } catch (error) {
      this.rethrowUniqueCode(error);
      throw error;
    }
  }

  private buildAdminWhere(query: ListAdminPlansQueryDto): Prisma.PlanWhereInput {
    const where: Prisma.PlanWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { code: { contains: term, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private validateFeatures(features: Record<string, unknown> | undefined): void {
    if (!features) {
      return;
    }

    const listingLimit = features.listingLimit;
    if (listingLimit !== undefined) {
      if (
        typeof listingLimit !== 'number' ||
        !Number.isInteger(listingLimit) ||
        listingLimit < 1
      ) {
        throw new BadRequestException('features.listingLimit must be a positive integer');
      }
    }
  }

  private async assertCodeAvailable(code: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.plan.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Plan code already exists');
    }
  }

  private rethrowUniqueCode(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Plan code already exists');
    }
  }
}
