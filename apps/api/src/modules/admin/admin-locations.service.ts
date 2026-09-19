import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { CreateAdminAreaDto } from './dto/create-admin-area.dto';
import { CreateAdminCityDto } from './dto/create-admin-city.dto';
import { CreateAdminCountryDto } from './dto/create-admin-country.dto';
import { CreateAdminDistrictDto } from './dto/create-admin-district.dto';
import { ListAdminCatalogsQueryDto } from './dto/list-admin-catalogs-query.dto';
import { UpdateAdminAreaDto } from './dto/update-admin-area.dto';
import { UpdateAdminCityDto } from './dto/update-admin-city.dto';
import { UpdateAdminCountryDto } from './dto/update-admin-country.dto';
import { UpdateAdminDistrictDto } from './dto/update-admin-district.dto';
import {
  AdminAreaDto,
  AdminCityDto,
  AdminCountryDto,
  AdminDistrictDto,
  toAdminArea,
  toAdminCity,
  toAdminCountry,
  toAdminDistrict,
} from './mapper/admin-location.mapper';

@Injectable()
export class AdminLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Countries ─────────────────────────────────────────────────────────────

  async listCountries(
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminCountryDto[]> {
    const rows = await this.prisma.country.findMany({
      where: this.buildSearchWhere(query.search, ['code', 'nameEn', 'nameAr']),
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminCountry);
  }

  async createCountry(dto: CreateAdminCountryDto): Promise<AdminCountryDto> {
    const code = this.normalizeCode(dto.code);
    await this.assertCountryCodeAvailable(code);

    try {
      const created = await this.prisma.country.create({
        data: {
          code,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminCountry(created);
    } catch (error) {
      this.rethrowDuplicate(error, 'Country code already exists');
      throw error;
    }
  }

  async updateCountry(
    id: string,
    dto: UpdateAdminCountryDto,
  ): Promise<AdminCountryDto> {
    const existing = await this.prisma.country.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Country not found');
    }

    const data: Prisma.CountryUpdateInput = {};

    if (dto.code !== undefined) {
      const code = this.normalizeCode(dto.code);
      if (code !== existing.code) {
        await this.assertCountryCodeAvailable(code, id);
      }
      data.code = code;
    }
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.country.update({ where: { id }, data });
      return toAdminCountry(updated);
    } catch (error) {
      this.rethrowDuplicate(error, 'Country code already exists');
      throw error;
    }
  }

  // ── Cities ────────────────────────────────────────────────────────────────

  async listCities(
    countryId: string,
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminCityDto[]> {
    await this.getCountryOrThrow(countryId);

    const rows = await this.prisma.city.findMany({
      where: {
        countryId,
        ...this.buildSearchWhere(query.search, ['slug', 'nameEn', 'nameAr']),
      },
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminCity);
  }

  async createCity(
    countryId: string,
    dto: CreateAdminCityDto,
  ): Promise<AdminCityDto> {
    await this.getCountryOrThrow(countryId);
    const slug = dto.slug.trim();
    await this.assertCitySlugAvailable(countryId, slug);

    try {
      const created = await this.prisma.city.create({
        data: {
          countryId,
          slug,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminCity(created);
    } catch (error) {
      this.rethrowDuplicate(error, 'City slug already exists in this country');
      throw error;
    }
  }

  async updateCity(id: string, dto: UpdateAdminCityDto): Promise<AdminCityDto> {
    const existing = await this.prisma.city.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('City not found');
    }

    const data: Prisma.CityUpdateInput = {};

    if (dto.slug !== undefined) {
      const slug = dto.slug.trim();
      if (slug !== existing.slug) {
        await this.assertCitySlugAvailable(existing.countryId, slug, id);
      }
      data.slug = slug;
    }
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.city.update({ where: { id }, data });
      return toAdminCity(updated);
    } catch (error) {
      this.rethrowDuplicate(error, 'City slug already exists in this country');
      throw error;
    }
  }

  // ── Areas ─────────────────────────────────────────────────────────────────

  async listAreas(
    cityId: string,
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminAreaDto[]> {
    await this.getCityOrThrow(cityId);

    const rows = await this.prisma.area.findMany({
      where: {
        cityId,
        ...this.buildSearchWhere(query.search, ['slug', 'nameEn', 'nameAr']),
      },
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminArea);
  }

  async createArea(
    cityId: string,
    dto: CreateAdminAreaDto,
  ): Promise<AdminAreaDto> {
    await this.getCityOrThrow(cityId);
    const slug = dto.slug.trim();
    await this.assertAreaSlugAvailable(cityId, slug);

    try {
      const created = await this.prisma.area.create({
        data: {
          cityId,
          slug,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminArea(created);
    } catch (error) {
      this.rethrowDuplicate(error, 'Area slug already exists in this city');
      throw error;
    }
  }

  async updateArea(id: string, dto: UpdateAdminAreaDto): Promise<AdminAreaDto> {
    const existing = await this.prisma.area.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Area not found');
    }

    const data: Prisma.AreaUpdateInput = {};

    if (dto.slug !== undefined) {
      const slug = dto.slug.trim();
      if (slug !== existing.slug) {
        await this.assertAreaSlugAvailable(existing.cityId, slug, id);
      }
      data.slug = slug;
    }
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.area.update({ where: { id }, data });
      return toAdminArea(updated);
    } catch (error) {
      this.rethrowDuplicate(error, 'Area slug already exists in this city');
      throw error;
    }
  }

  // ── Districts ─────────────────────────────────────────────────────────────

  async listDistricts(
    areaId: string,
    query: ListAdminCatalogsQueryDto,
  ): Promise<AdminDistrictDto[]> {
    await this.getAreaOrThrow(areaId);

    const rows = await this.prisma.district.findMany({
      where: {
        areaId,
        ...this.buildSearchWhere(query.search, ['slug', 'nameEn', 'nameAr']),
      },
      orderBy: { nameEn: 'asc' },
    });

    return rows.map(toAdminDistrict);
  }

  async createDistrict(
    areaId: string,
    dto: CreateAdminDistrictDto,
  ): Promise<AdminDistrictDto> {
    await this.getAreaOrThrow(areaId);
    const slug = dto.slug.trim();
    await this.assertDistrictSlugAvailable(areaId, slug);

    try {
      const created = await this.prisma.district.create({
        data: {
          areaId,
          slug,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminDistrict(created);
    } catch (error) {
      this.rethrowDuplicate(error, 'District slug already exists in this area');
      throw error;
    }
  }

  async updateDistrict(
    id: string,
    dto: UpdateAdminDistrictDto,
  ): Promise<AdminDistrictDto> {
    const existing = await this.prisma.district.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('District not found');
    }

    const data: Prisma.DistrictUpdateInput = {};

    if (dto.slug !== undefined) {
      const slug = dto.slug.trim();
      if (slug !== existing.slug) {
        await this.assertDistrictSlugAvailable(existing.areaId, slug, id);
      }
      data.slug = slug;
    }
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.district.update({ where: { id }, data });
      return toAdminDistrict(updated);
    } catch (error) {
      this.rethrowDuplicate(error, 'District slug already exists in this area');
      throw error;
    }
  }

  async deleteDistrict(id: string): Promise<{ id: string; deleted: boolean }> {
    const existing = await this.prisma.district.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    });

    if (!existing) {
      throw new NotFoundException('District not found');
    }

    // Soft-deactivate when still linked to listings; hard-delete when unused.
    if (existing._count.properties > 0) {
      await this.prisma.district.update({ where: { id }, data: { isActive: false } });
      return { id, deleted: false };
    }

    await this.prisma.district.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async getCountryOrThrow(countryId: string) {
    const country = await this.prisma.country.findUnique({ where: { id: countryId } });
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }

  private async getCityOrThrow(cityId: string) {
    const city = await this.prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  private async getAreaOrThrow(areaId: string) {
    const area = await this.prisma.area.findUnique({ where: { id: areaId } });
    if (!area) {
      throw new NotFoundException('Area not found');
    }
    return area;
  }

  private normalizeCode(code: string): string {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      throw new BadRequestException('Code is required');
    }
    return normalized;
  }

  private buildSearchWhere(
    search: string | undefined,
    fields: string[],
  ): { OR?: Array<Record<string, { contains: string; mode: 'insensitive' }>> } {
    const term = search?.trim();
    if (!term) {
      return {};
    }

    return {
      OR: fields.map((field) => ({
        [field]: { contains: term, mode: 'insensitive' as const },
      })),
    };
  }

  private async assertCountryCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.country.findUnique({
      where: { code },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Country code already exists');
    }
  }

  private async assertCitySlugAvailable(
    countryId: string,
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.city.findUnique({
      where: { countryId_slug: { countryId, slug } },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('City slug already exists in this country');
    }
  }

  private async assertAreaSlugAvailable(
    cityId: string,
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.area.findUnique({
      where: { cityId_slug: { cityId, slug } },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Area slug already exists in this city');
    }
  }

  private async assertDistrictSlugAvailable(
    areaId: string,
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.district.findUnique({
      where: { areaId_slug: { areaId, slug } },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('District slug already exists in this area');
    }
  }

  private rethrowDuplicate(error: unknown, message: string): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new BadRequestException(message);
    }
  }
}
