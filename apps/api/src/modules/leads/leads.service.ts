import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import {
  BuyerLeadResponseDto,
  LeadCreatedResponseDto,
  SellerLeadResponseDto,
  toBuyerLeadResponse,
  toLeadCreatedResponse,
  toSellerLeadResponse,
} from './mapper/lead.mapper';

const propertyImageInclude = {
  images: {
    include: { mediaAsset: true },
    orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }],
  },
};

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    buyerId: string,
    propertyId: string,
    dto: CreateLeadDto,
  ): Promise<LeadCreatedResponseDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        status: true,
        ownerId: true,
        slug: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PUBLISHED) {
      throw new BadRequestException('Only published properties can receive leads');
    }

    if (property.ownerId === buyerId) {
      throw new ForbiddenException('You cannot create a lead on your own property');
    }

    const buyer = await this.prisma.user.findUnique({
      where: { id: buyerId },
      select: { phone: true, email: true },
    });

    const lead = await this.prisma.lead.create({
      data: {
        propertyId: property.id,
        buyerId,
        sellerId: property.ownerId,
        type: dto.type,
        message: dto.message?.trim() || null,
        phone: buyer?.phone ?? null,
        email: buyer?.email ?? null,
      },
    });

    await this.notificationsService.notifyNewLead({
      ownerId: property.ownerId,
      propertyId: property.id,
      propertySlug: property.slug,
      leadId: lead.id,
    });

    return toLeadCreatedResponse(lead);
  }

  async listMine(buyerId: string): Promise<BuyerLeadResponseDto[]> {
    const leads = await this.prisma.lead.findMany({
      where: { buyerId },
      include: {
        property: {
          include: propertyImageInclude,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(toBuyerLeadResponse);
  }

  async listForSeller(sellerId: string): Promise<SellerLeadResponseDto[]> {
    const leads = await this.prisma.lead.findMany({
      where: { sellerId },
      include: {
        buyer: true,
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(toSellerLeadResponse);
  }

  async updateStatus(
    sellerId: string,
    leadId: string,
    dto: UpdateLeadStatusDto,
  ): Promise<SellerLeadResponseDto> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        buyer: true,
        property: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.sellerId !== sellerId) {
      throw new ForbiddenException('Only the property owner can update lead status');
    }

    const updated = await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: dto.status },
      include: {
        buyer: true,
        property: true,
      },
    });

    return toSellerLeadResponse(updated);
  }
}
