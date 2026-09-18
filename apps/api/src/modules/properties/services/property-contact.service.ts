import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PropertyContactSource,
  PropertyContactType,
  PropertyStatus,
  type PropertyContact,
  type User,
} from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../../database/prisma.service';
import {
  PropertyContactResponseDto,
  PublicPropertyContactViewDto,
  UpsertPropertyContactDto,
} from '../dto/upsert-property-contact.dto';

function trimOrNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function ownerDisplayName(owner: User): string | null {
  const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim();
  return name.length > 0 ? name : null;
}

@Injectable()
export class PropertyContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getForOwner(
    ownerId: string,
    propertyId: string,
  ): Promise<PropertyContactResponseDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true, contact: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ForbiddenException('Not the property owner');
    }
    return this.resolveContact(property.id, property.owner, property.contact);
  }

  async upsertForOwner(
    ownerId: string,
    propertyId: string,
    dto: UpsertPropertyContactDto,
  ): Promise<PropertyContactResponseDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true, contact: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ForbiddenException('Not the property owner');
    }
    if (
      property.status !== PropertyStatus.DRAFT &&
      property.status !== PropertyStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Contact can only be edited while the property is a draft or rejected',
      );
    }

    await this.persist(propertyId, dto);
    return this.getForOwner(ownerId, propertyId);
  }

  async getForAdmin(propertyId: string): Promise<PropertyContactResponseDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true, contact: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return this.resolveContact(property.id, property.owner, property.contact);
  }

  async upsertForAdmin(
    propertyId: string,
    dto: UpsertPropertyContactDto,
  ): Promise<PropertyContactResponseDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    await this.persist(propertyId, dto);
    return this.getForAdmin(propertyId);
  }

  async getPublicByPropertyId(
    propertyId: string,
  ): Promise<PublicPropertyContactViewDto> {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, status: PropertyStatus.PUBLISHED },
      include: { owner: true, contact: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return this.toPublicView(
      this.resolveContact(property.id, property.owner, property.contact),
    );
  }

  /**
   * Ensures a PropertyContact row exists for published listings.
   * Does not overwrite an existing CUSTOM contact.
   */
  async ensureDefaultOwnerContact(propertyId: string): Promise<void> {
    const existing = await this.prisma.propertyContact.findUnique({
      where: { propertyId },
      select: { id: true, source: true },
    });
    if (existing) {
      return;
    }

    await this.prisma.propertyContact.create({
      data: {
        propertyId,
        source: PropertyContactSource.OWNER,
        contactType: PropertyContactType.OWNER,
        name: null,
        phone: null,
        whatsapp: null,
        email: null,
      },
    });
  }

  resolveContact(
    propertyId: string,
    owner: User,
    row: PropertyContact | null,
  ): PropertyContactResponseDto {
    const source = row?.source ?? PropertyContactSource.OWNER;

    if (source === PropertyContactSource.CUSTOM && row) {
      return {
        propertyId,
        source: PropertyContactSource.CUSTOM,
        contactType: row.contactType,
        name: row.name,
        phone: row.phone,
        whatsapp: row.whatsapp ?? row.phone,
        email: row.email,
      };
    }

    // OWNER source — resolve live from owner profile (independent stored nulls).
    return {
      propertyId,
      source: PropertyContactSource.OWNER,
      contactType: PropertyContactType.OWNER,
      name: ownerDisplayName(owner),
      phone: owner.phone,
      whatsapp: owner.phone,
      email: owner.email,
    };
  }

  toPublicView(resolved: PropertyContactResponseDto): PublicPropertyContactViewDto {
    return {
      name: resolved.name,
      type: resolved.contactType,
      phone: resolved.phone,
      whatsapp: resolved.whatsapp,
    };
  }

  private async persist(
    propertyId: string,
    dto: UpsertPropertyContactDto,
  ): Promise<void> {
    if (dto.source === PropertyContactSource.CUSTOM) {
      const phone = trimOrNull(dto.phone);
      if (!phone) {
        throw new BadRequestException('Phone is required for custom contact');
      }
      const name = trimOrNull(dto.name);
      if (!name) {
        throw new BadRequestException('Name is required for custom contact');
      }

      await this.prisma.propertyContact.upsert({
        where: { propertyId },
        create: {
          propertyId,
          source: PropertyContactSource.CUSTOM,
          contactType: dto.contactType ?? PropertyContactType.AGENT,
          name,
          phone,
          whatsapp: trimOrNull(dto.whatsapp),
          email: trimOrNull(dto.email),
        },
        update: {
          source: PropertyContactSource.CUSTOM,
          contactType: dto.contactType ?? PropertyContactType.AGENT,
          name,
          phone,
          whatsapp: trimOrNull(dto.whatsapp),
          email: trimOrNull(dto.email),
        },
      });
      return;
    }

    await this.prisma.propertyContact.upsert({
      where: { propertyId },
      create: {
        propertyId,
        source: PropertyContactSource.OWNER,
        contactType: PropertyContactType.OWNER,
        name: null,
        phone: null,
        whatsapp: null,
        email: null,
      },
      update: {
        source: PropertyContactSource.OWNER,
        contactType: PropertyContactType.OWNER,
        name: null,
        phone: null,
        whatsapp: null,
        email: null,
      },
    });
  }
}
