import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Property, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  PropertyResponseDto,
  toPropertyResponse,
} from './mapper/property.mapper';
import { createTemporaryDraftSlug, slugifyTitle } from './utils/slug.util';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(
    ownerId: string,
    dto: CreateDraftDto,
  ): Promise<PropertyResponseDto> {
    const title = dto.title?.trim() || null;
    const baseSlug = title
      ? slugifyTitle(title)
      : createTemporaryDraftSlug();
    const slug = await this.ensureUniqueSlug(baseSlug);

    const property = await this.prisma.property.create({
      data: {
        ownerId,
        title,
        slug,
        status: PropertyStatus.DRAFT,
      },
    });

    return toPropertyResponse(property);
  }

  async listMine(
    ownerId: string,
    status?: PropertyStatus,
  ): Promise<PropertyResponseDto[]> {
    const properties = await this.prisma.property.findMany({
      where: {
        ownerId,
        ...(status ? { status } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return properties.map(toPropertyResponse);
  }

  async getMine(ownerId: string, propertyId: string): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    return toPropertyResponse(property);
  }

  async updateDraft(
    ownerId: string,
    propertyId: string,
    dto: UpdatePropertyDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    this.assertDraftEditable(property);

    await this.validateUpdateReferences(property, dto);

    const data: Prisma.PropertyUpdateInput = {};

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      data.title = title;
      data.slug = await this.ensureUniqueSlug(slugifyTitle(title), property.id);
    }

    if (dto.propertyTypeId !== undefined) {
      data.propertyType = { connect: { id: dto.propertyTypeId } };
    }
    if (dto.transactionTypeId !== undefined) {
      data.transactionType = { connect: { id: dto.transactionTypeId } };
    }
    if (dto.areaId !== undefined) {
      data.area = { connect: { id: dto.areaId } };
    }
    if (dto.districtId !== undefined) {
      data.district =
        dto.districtId === null
          ? { disconnect: true }
          : { connect: { id: dto.districtId } };
    }
    if (dto.compoundId !== undefined) {
      data.compound =
        dto.compoundId === null
          ? { disconnect: true }
          : { connect: { id: dto.compoundId } };
    }
    if (dto.address !== undefined) {
      data.address = dto.address?.trim() || null;
    }
    if (dto.latitude !== undefined) {
      data.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      data.longitude = dto.longitude;
    }
    if (dto.bedrooms !== undefined) {
      data.bedrooms = dto.bedrooms;
    }
    if (dto.bathrooms !== undefined) {
      data.bathrooms = dto.bathrooms;
    }
    if (dto.areaSqm !== undefined) {
      data.areaSqm = dto.areaSqm;
    }
    if (dto.floor !== undefined) {
      data.floor = dto.floor;
    }
    if (dto.furnished !== undefined) {
      data.furnished = dto.furnished;
    }
    if (dto.rentPeriod !== undefined) {
      data.rentPeriod = dto.rentPeriod;
    }
    if (dto.price !== undefined) {
      data.price = dto.price;
    }

    const updated = await this.prisma.property.update({
      where: { id: property.id },
      data,
    });

    return toPropertyResponse(updated);
  }

  async deleteDraft(ownerId: string, propertyId: string): Promise<{ message: string }> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);

    if (property.status !== PropertyStatus.DRAFT) {
      throw new ForbiddenException('Only draft properties can be deleted');
    }

    await this.prisma.property.delete({ where: { id: property.id } });

    return { message: 'Draft property deleted successfully' };
  }

  private async findOwnedOrThrow(
    ownerId: string,
    propertyId: string,
  ): Promise<Property> {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  private assertDraftEditable(property: Property): void {
    if (property.status !== PropertyStatus.DRAFT) {
      throw new ForbiddenException('Only draft properties can be updated');
    }
  }

  private async ensureUniqueSlug(
    base: string,
    excludeId?: string,
  ): Promise<string> {
    let candidate = base;
    let suffix = 0;

    while (true) {
      const existing = await this.prisma.property.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing || existing.id === excludeId) {
        return candidate;
      }

      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
  }

  private async validateUpdateReferences(
    property: Property,
    dto: UpdatePropertyDto,
  ): Promise<void> {
    if (dto.propertyTypeId) {
      const type = await this.prisma.propertyType.findFirst({
        where: { id: dto.propertyTypeId, isActive: true },
        select: { id: true },
      });
      if (!type) {
        throw new BadRequestException('Invalid property type');
      }
    }

    if (dto.transactionTypeId) {
      const type = await this.prisma.transactionType.findFirst({
        where: { id: dto.transactionTypeId, isActive: true },
        select: { id: true },
      });
      if (!type) {
        throw new BadRequestException('Invalid transaction type');
      }
    }

    if (dto.areaId) {
      const area = await this.prisma.area.findFirst({
        where: { id: dto.areaId, isActive: true },
        select: { id: true },
      });
      if (!area) {
        throw new BadRequestException('Invalid area');
      }
    }

    if (dto.districtId) {
      const district = await this.prisma.district.findFirst({
        where: { id: dto.districtId, isActive: true },
        select: { id: true, areaId: true },
      });
      if (!district) {
        throw new BadRequestException('Invalid district');
      }

      const areaId = dto.areaId ?? property.areaId;
      if (areaId && district.areaId !== areaId) {
        throw new BadRequestException('District does not belong to the selected area');
      }
    }

    if (dto.compoundId) {
      const compound = await this.prisma.compound.findFirst({
        where: { id: dto.compoundId, isActive: true },
        select: { id: true },
      });
      if (!compound) {
        throw new BadRequestException('Invalid compound');
      }
    }
  }
}
