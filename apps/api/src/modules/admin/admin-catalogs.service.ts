import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { CreateAdminFeatureDto } from './dto/create-admin-feature.dto';
import { CreateAdminPropertyTypeDto } from './dto/create-admin-property-type.dto';
import { CreateAdminPropertyLegalStatusDto } from './dto/create-admin-property-legal-status.dto';
import { CreateAdminPropertyViewDto } from './dto/create-admin-property-view.dto';
import { CreateAdminTransactionTypeDto } from './dto/create-admin-transaction-type.dto';
import {
  ListAdminCatalogsQueryDto,
  ListAdminFeaturesQueryDto,
} from './dto/list-admin-catalogs-query.dto';
import { UpdateAdminFeatureDto } from './dto/update-admin-feature.dto';
import { UpdateAdminPropertyLegalStatusDto } from './dto/update-admin-property-legal-status.dto';
import { UpdateAdminPropertyTypeDto } from './dto/update-admin-property-type.dto';
import { UpdateAdminPropertyViewDto } from './dto/update-admin-property-view.dto';
import { UpdateAdminTransactionTypeDto } from './dto/update-admin-transaction-type.dto';
import {
  AdminFeatureDto,
  AdminFinishingTypeDto,
  AdminPropertyLegalStatusDto,
  AdminPropertyTypeDto,
  AdminPropertyViewDto,
  AdminTransactionTypeDto,
  listAdminFinishingTypes,
  toAdminFeature,
  toAdminPropertyLegalStatus,
  toAdminPropertyType,
  toAdminPropertyView,
  toAdminTransactionType,
} from './mapper/admin-catalog.mapper';

@Injectable()
export class AdminCatalogsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Property types ────────────────────────────────────────────────────────

  async listPropertyTypes(
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminPropertyTypeDto[]> {
    const rows = await this.prisma.propertyType.findMany({
      where: this.buildSearchWhere(query.search),
      orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
    });

    return rows.map(toAdminPropertyType);
  }

  async createPropertyType(
    dto: CreateAdminPropertyTypeDto,
  ): Promise<AdminPropertyTypeDto> {
    const code = this.normalizeCode(dto.code);
    await this.assertPropertyTypeCodeAvailable(code);

    try {
      const created = await this.prisma.propertyType.create({
        data: {
          code,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          sortOrder: dto.sortOrder ?? 0,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminPropertyType(created);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Property type');
      throw error;
    }
  }

  async updatePropertyType(
    id: string,
    dto: UpdateAdminPropertyTypeDto,
  ): Promise<AdminPropertyTypeDto> {
    const existing = await this.prisma.propertyType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Property type not found');
    }

    const data: Prisma.PropertyTypeUpdateInput = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);
      if (code !== existing.code) {
        await this.assertPropertyTypeCodeAvailable(code, id);
      }
      data.code = code;
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.trim();
    }
    if (dto.nameAr !== undefined) {
      data.nameAr = dto.nameAr?.trim() || null;
    }
    if (dto.sortOrder !== undefined) {
      data.sortOrder = dto.sortOrder;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.propertyType.update({
        where: { id },
        data,
      });

      return toAdminPropertyType(updated);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Property type');
      throw error;
    }
  }

  // ── Transaction types ─────────────────────────────────────────────────────

  async listTransactionTypes(
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminTransactionTypeDto[]> {
    const rows = await this.prisma.transactionType.findMany({
      where: this.buildSearchWhere(query.search),
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminTransactionType);
  }

  async createTransactionType(
    dto: CreateAdminTransactionTypeDto,
  ): Promise<AdminTransactionTypeDto> {
    const code = this.normalizeCode(dto.code);
    await this.assertTransactionTypeCodeAvailable(code);

    try {
      const created = await this.prisma.transactionType.create({
        data: {
          code,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminTransactionType(created);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Transaction type');
      throw error;
    }
  }

  async updateTransactionType(
    id: string,
    dto: UpdateAdminTransactionTypeDto,
  ): Promise<AdminTransactionTypeDto> {
    const existing = await this.prisma.transactionType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Transaction type not found');
    }

    const data: Prisma.TransactionTypeUpdateInput = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);
      if (code !== existing.code) {
        await this.assertTransactionTypeCodeAvailable(code, id);
      }
      data.code = code;
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.trim();
    }
    if (dto.nameAr !== undefined) {
      data.nameAr = dto.nameAr?.trim() || null;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.transactionType.update({
        where: { id },
        data,
      });

      return toAdminTransactionType(updated);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Transaction type');
      throw error;
    }
  }

  // ── Features ──────────────────────────────────────────────────────────────

  async listFeatures(
    query: ListAdminFeaturesQueryDto,
  ): Promise<AdminFeatureDto[]> {
    const where: Prisma.FeatureWhereInput = {
      ...this.buildSearchWhere(query.search),
    };

    if (query.category?.trim()) {
      where.category = query.category.trim();
    }

    const rows = await this.prisma.feature.findMany({
      where,
      orderBy: [{ category: 'asc' }, { nameEn: 'asc' }],
    });

    return rows.map(toAdminFeature);
  }

  async createFeature(dto: CreateAdminFeatureDto): Promise<AdminFeatureDto> {
    const code = this.normalizeCode(dto.code);
    await this.assertFeatureCodeAvailable(code);

    try {
      const created = await this.prisma.feature.create({
        data: {
          code,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          category: this.normalizeFeatureCategory(dto.category),
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminFeature(created);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Feature');
      throw error;
    }
  }

  async updateFeature(
    id: string,
    dto: UpdateAdminFeatureDto,
  ): Promise<AdminFeatureDto> {
    const existing = await this.prisma.feature.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Feature not found');
    }

    const data: Prisma.FeatureUpdateInput = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);
      if (code !== existing.code) {
        await this.assertFeatureCodeAvailable(code, id);
      }
      data.code = code;
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.trim();
    }
    if (dto.nameAr !== undefined) {
      data.nameAr = dto.nameAr?.trim() || null;
    }
    if (dto.category !== undefined) {
      data.category = this.normalizeFeatureCategory(dto.category);
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.feature.update({
        where: { id },
        data,
      });

      return toAdminFeature(updated);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Feature');
      throw error;
    }
  }

  async deleteFeature(id: string): Promise<{ id: string; deleted: boolean }> {
    const existing = await this.prisma.feature.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Feature not found');
    }

    // Soft-deactivate when still linked to listings; hard-delete when unused.
    if (existing._count.properties > 0) {
      await this.prisma.feature.update({
        where: { id },
        data: { isActive: false },
      });
      return { id, deleted: false };
    }

    await this.prisma.feature.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ── Property views ────────────────────────────────────────────────────────

  async listPropertyViews(
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminPropertyViewDto[]> {
    const rows = await this.prisma.propertyView.findMany({
      where: this.buildSearchWhere(query.search),
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminPropertyView);
  }

  async createPropertyView(
    dto: CreateAdminPropertyViewDto,
  ): Promise<AdminPropertyViewDto> {
    const code = this.normalizeCode(dto.code);
    await this.assertPropertyViewCodeAvailable(code);

    try {
      const created = await this.prisma.propertyView.create({
        data: {
          code,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminPropertyView(created);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Property view');
      throw error;
    }
  }

  async updatePropertyView(
    id: string,
    dto: UpdateAdminPropertyViewDto,
  ): Promise<AdminPropertyViewDto> {
    const existing = await this.prisma.propertyView.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Property view not found');
    }

    const data: Prisma.PropertyViewUpdateInput = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);
      if (code !== existing.code) {
        await this.assertPropertyViewCodeAvailable(code, id);
      }
      data.code = code;
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.trim();
    }
    if (dto.nameAr !== undefined) {
      data.nameAr = dto.nameAr?.trim() || null;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.propertyView.update({
        where: { id },
        data,
      });

      return toAdminPropertyView(updated);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Property view');
      throw error;
    }
  }

  async deletePropertyView(id: string): Promise<{ id: string; deleted: boolean }> {
    const existing = await this.prisma.propertyView.findUnique({
      where: { id },
      include: { _count: { select: { assignments: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Property view not found');
    }

    // Soft-deactivate when still linked to listings; hard-delete when unused.
    if (existing._count.assignments > 0) {
      await this.prisma.propertyView.update({
        where: { id },
        data: { isActive: false },
      });
      return { id, deleted: false };
    }

    await this.prisma.propertyView.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ── Legal statuses ────────────────────────────────────────────────────────

  async listPropertyLegalStatuses(
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminPropertyLegalStatusDto[]> {
    const rows = await this.prisma.propertyLegalStatus.findMany({
      where: this.buildSearchWhere(query.search),
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminPropertyLegalStatus);
  }

  async createPropertyLegalStatus(
    dto: CreateAdminPropertyLegalStatusDto,
  ): Promise<AdminPropertyLegalStatusDto> {
    const code = this.normalizeCode(dto.code);
    await this.assertPropertyLegalStatusCodeAvailable(code);

    try {
      const created = await this.prisma.propertyLegalStatus.create({
        data: {
          code,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminPropertyLegalStatus(created);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Legal status');
      throw error;
    }
  }

  async updatePropertyLegalStatus(
    id: string,
    dto: UpdateAdminPropertyLegalStatusDto,
  ): Promise<AdminPropertyLegalStatusDto> {
    const existing = await this.prisma.propertyLegalStatus.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Legal status not found');
    }

    const data: Prisma.PropertyLegalStatusUpdateInput = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);
      if (code !== existing.code) {
        await this.assertPropertyLegalStatusCodeAvailable(code, id);
      }
      data.code = code;
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.trim();
    }
    if (dto.nameAr !== undefined) {
      data.nameAr = dto.nameAr?.trim() || null;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.propertyLegalStatus.update({
        where: { id },
        data,
      });

      return toAdminPropertyLegalStatus(updated);
    } catch (error) {
      this.rethrowDuplicateCode(error, 'Legal status');
      throw error;
    }
  }

  async deletePropertyLegalStatus(
    id: string,
  ): Promise<{ id: string; deleted: boolean }> {
    const existing = await this.prisma.propertyLegalStatus.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Legal status not found');
    }

    if (existing._count.properties > 0) {
      await this.prisma.propertyLegalStatus.update({
        where: { id },
        data: { isActive: false },
      });
      return { id, deleted: false };
    }

    await this.prisma.propertyLegalStatus.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ── Finishing types (enum, read-only) ─────────────────────────────────────

  listFinishingTypes(): AdminFinishingTypeDto[] {
    return listAdminFinishingTypes();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private normalizeCode(code: string): string {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      throw new BadRequestException('Code is required');
    }
    return normalized;
  }

  /** Keep category keys stable for grouping (amenities | indoor | outdoor). */
  private normalizeFeatureCategory(
    category: string | null | undefined,
  ): string | null {
    if (category == null) return null;
    const trimmed = category.trim();
    if (!trimmed) return null;
    const key = trimmed.toLowerCase();
    if (key === 'amenities' || key === 'amenity') return 'amenities';
    if (key === 'indoor') return 'indoor';
    if (key === 'outdoor') return 'outdoor';
    if (trimmed === 'أساسية') return 'amenities';
    if (trimmed === 'داخلية') return 'indoor';
    if (trimmed === 'خارجية') return 'outdoor';
    return key;
  }

  private buildSearchWhere(search?: string): {
    OR?: Array<{
      code?: { contains: string; mode: 'insensitive' };
      nameEn?: { contains: string; mode: 'insensitive' };
      nameAr?: { contains: string; mode: 'insensitive' };
    }>;
  } {
    const term = search?.trim();
    if (!term) {
      return {};
    }

    return {
      OR: [
        { code: { contains: term, mode: 'insensitive' } },
        { nameEn: { contains: term, mode: 'insensitive' } },
        { nameAr: { contains: term, mode: 'insensitive' } },
      ],
    };
  }

  private async assertPropertyTypeCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.propertyType.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Property type code already exists');
    }
  }

  private async assertTransactionTypeCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.transactionType.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Transaction type code already exists');
    }
  }

  private async assertFeatureCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.feature.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Feature code already exists');
    }
  }

  private async assertPropertyViewCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.propertyView.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Property view code already exists');
    }
  }

  private async assertPropertyLegalStatusCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.propertyLegalStatus.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Legal status code already exists');
    }
  }

  private rethrowDuplicateCode(error: unknown, entityLabel: string): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new BadRequestException(`${entityLabel} code already exists`);
    }
  }
}
