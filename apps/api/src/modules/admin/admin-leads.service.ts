import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus, Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { ListAdminLeadsQueryDto } from './dto/list-admin-leads-query.dto';
import { UpdateAdminLeadStatusDto } from './dto/update-admin-lead-status.dto';
import {
  ADMIN_LEAD_INCLUDE,
  AdminLeadDto,
  AdminLeadSource,
  toAdminLead,
} from './mapper/admin-lead.mapper';

@Injectable()
export class AdminLeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async listLeads(query: ListAdminLeadsQueryDto): Promise<{
    data: AdminLeadDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [total, rows] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
        where,
        include: ADMIN_LEAD_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) => toAdminLead(row as AdminLeadSource)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getLeadDetails(leadId: string): Promise<AdminLeadDto> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: ADMIN_LEAD_INCLUDE,
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return toAdminLead(lead as AdminLeadSource);
  }

  async updateLeadStatus(
    leadId: string,
    dto: UpdateAdminLeadStatusDto,
  ): Promise<AdminLeadDto> {
    const existing = await this.prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Lead not found');
    }

    const updated = await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: dto.status as LeadStatus },
      include: ADMIN_LEAD_INCLUDE,
    });

    return toAdminLead(updated as AdminLeadSource);
  }

  private buildWhere(query: ListAdminLeadsQueryDto): Prisma.LeadWhereInput {
    const where: Prisma.LeadWhereInput = {};

    if (query.status) {
      where.status = query.status as LeadStatus;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        {
          buyer: {
            email: { contains: term, mode: 'insensitive' },
          },
        },
        {
          seller: {
            email: { contains: term, mode: 'insensitive' },
          },
        },
        {
          property: {
            title: { contains: term, mode: 'insensitive' },
          },
        },
        {
          phone: { contains: term, mode: 'insensitive' },
        },
      ];
    }

    return where;
  }
}
