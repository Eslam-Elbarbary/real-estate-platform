import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CatalogFeatureDto,
  CatalogLegalStatusDto,
  CatalogPropertyTypeDto,
  CatalogPropertyViewDto,
  CatalogTransactionTypeDto,
  toCatalogFeature,
  toCatalogLegalStatus,
  toCatalogPropertyType,
  toCatalogPropertyView,
  toCatalogTransactionType,
} from './mapper/catalog.mapper';

@Injectable()
export class CatalogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPropertyTypes(): Promise<CatalogPropertyTypeDto[]> {
    const rows = await this.prisma.propertyType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return rows.map(toCatalogPropertyType);
  }

  async getTransactionTypes(): Promise<CatalogTransactionTypeDto[]> {
    const rows = await this.prisma.transactionType.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toCatalogTransactionType);
  }

  async getFeatures(): Promise<CatalogFeatureDto[]> {
    const rows = await this.prisma.feature.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { nameEn: 'asc' }],
    });

    return rows.map(toCatalogFeature);
  }

  async getPropertyViews(): Promise<CatalogPropertyViewDto[]> {
    const rows = await this.prisma.propertyView.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toCatalogPropertyView);
  }

  async getLegalStatuses(): Promise<CatalogLegalStatusDto[]> {
    const rows = await this.prisma.propertyLegalStatus.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toCatalogLegalStatus);
  }
}
