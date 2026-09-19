import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ListAdminCatalogsQueryDto } from './dto/list-admin-catalogs-query.dto';
import { CompanyDto, toCompanyDto } from '../companies/mapper/company.mapper';

@Injectable()
export class AdminCompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListAdminCatalogsQueryDto): Promise<CompanyDto[]> {
    const term = query.search?.trim();

    const rows = await this.prisma.company.findMany({
      where: term
        ? {
            OR: [
              { slug: { contains: term, mode: 'insensitive' } },
              { nameEn: { contains: term, mode: 'insensitive' } },
              { nameAr: { contains: term, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(toCompanyDto);
  }

  async setActive(id: string, isActive: boolean): Promise<CompanyDto> {
    const existing = await this.prisma.company.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Company not found');
    }

    const updated = await this.prisma.company.update({
      where: { id },
      data: { isActive },
    });
    return toCompanyDto(updated);
  }
}
