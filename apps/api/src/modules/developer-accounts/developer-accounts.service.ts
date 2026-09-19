import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeveloperMemberRole, Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import {
  AdminCompoundDto,
  toAdminCompound,
} from '../compounds/mapper/compound.mapper';
import { AddDeveloperMemberDto } from './dto/add-developer-member.dto';
import { CreateDeveloperAccountDto } from './dto/create-developer-account.dto';
import { CreateMemberCompoundDto } from './dto/create-member-compound.dto';
import { UpdateDeveloperAccountDto } from './dto/update-developer-account.dto';
import { UpdateDeveloperMemberDto } from './dto/update-developer-member.dto';
import { UpdateMemberCompoundDto } from './dto/update-member-compound.dto';
import {
  DeveloperAccountDto,
  DeveloperAccountMembershipDto,
  DeveloperMemberDto,
  toDeveloperAccountDto,
  toDeveloperAccountMembershipDto,
  toDeveloperMemberDto,
} from './mapper/developer-account.mapper';

/** Roles allowed to manage the developer profile, members, and compounds — not delete the account or grant OWNER. */
const MANAGER_ROLES: DeveloperMemberRole[] = [
  DeveloperMemberRole.OWNER,
  DeveloperMemberRole.MANAGER,
];

@Injectable()
export class DeveloperAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateDeveloperAccountDto,
  ): Promise<DeveloperAccountDto> {
    await this.assertSlugAvailable(dto.slug);

    try {
      const developer = await this.prisma.developer.create({
        data: {
          slug: dto.slug,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          description: dto.description?.trim() || null,
          website: dto.website?.trim() || null,
          logoUrl: dto.logoUrl?.trim() || null,
          members: {
            create: { userId, role: DeveloperMemberRole.OWNER },
          },
        },
      });
      return toDeveloperAccountDto(developer);
    } catch (error) {
      this.rethrowDuplicateSlug(error);
      throw error;
    }
  }

  async listMine(userId: string): Promise<DeveloperAccountMembershipDto[]> {
    const memberships = await this.prisma.developerMember.findMany({
      where: { userId },
      include: { developer: true },
      orderBy: { createdAt: 'asc' },
    });
    return memberships.map((row) =>
      toDeveloperAccountMembershipDto(row.developer, row.role),
    );
  }

  async getById(userId: string, developerId: string): Promise<DeveloperAccountDto> {
    const developer = await this.getDeveloperOrThrow(developerId);
    await this.getMembershipOrThrow(userId, developerId);
    return toDeveloperAccountDto(developer);
  }

  async update(
    userId: string,
    developerId: string,
    dto: UpdateDeveloperAccountDto,
  ): Promise<DeveloperAccountDto> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    this.assertRole(membership.role, MANAGER_ROLES);

    if (dto.slug !== undefined) {
      await this.assertSlugAvailable(dto.slug, developerId);
    }

    const data: Prisma.DeveloperUpdateInput = {};
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.description !== undefined) data.description = dto.description?.trim() || null;
    if (dto.logoUrl !== undefined) data.logoUrl = dto.logoUrl?.trim() || null;
    if (dto.website !== undefined) data.website = dto.website?.trim() || null;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.developer.update({
        where: { id: developerId },
        data,
      });
      return toDeveloperAccountDto(updated);
    } catch (error) {
      this.rethrowDuplicateSlug(error);
      throw error;
    }
  }

  async remove(userId: string, developerId: string): Promise<{ id: string }> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    this.assertRole(membership.role, [DeveloperMemberRole.OWNER]);

    await this.prisma.developer.delete({ where: { id: developerId } });
    return { id: developerId };
  }

  async listMembers(userId: string, developerId: string): Promise<DeveloperMemberDto[]> {
    await this.getDeveloperOrThrow(developerId);
    await this.getMembershipOrThrow(userId, developerId);

    const members = await this.prisma.developerMember.findMany({
      where: { developerId },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return members.map(toDeveloperMemberDto);
  }

  async addMember(
    userId: string,
    developerId: string,
    dto: AddDeveloperMemberDto,
  ): Promise<DeveloperMemberDto> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    this.assertRole(membership.role, MANAGER_ROLES);

    const role = dto.role ?? DeveloperMemberRole.STAFF;
    if (role === DeveloperMemberRole.OWNER && membership.role !== DeveloperMemberRole.OWNER) {
      throw new ForbiddenException('Only an OWNER can grant the OWNER role');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!targetUser) {
      throw new NotFoundException('No registered user with that email');
    }

    const existing = await this.prisma.developerMember.findUnique({
      where: { developerId_userId: { developerId, userId: targetUser.id } },
    });
    if (existing) {
      throw new BadRequestException('User is already a member of this developer account');
    }

    const created = await this.prisma.developerMember.create({
      data: { developerId, userId: targetUser.id, role },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });
    return toDeveloperMemberDto(created);
  }

  async updateMemberRole(
    userId: string,
    developerId: string,
    memberId: string,
    dto: UpdateDeveloperMemberDto,
  ): Promise<DeveloperMemberDto> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    this.assertRole(membership.role, [DeveloperMemberRole.OWNER]);

    const target = await this.getMemberOrThrow(developerId, memberId);
    if (target.role === DeveloperMemberRole.OWNER && dto.role !== DeveloperMemberRole.OWNER) {
      await this.assertNotLastOwner(developerId, memberId);
    }

    const updated = await this.prisma.developerMember.update({
      where: { id: memberId },
      data: { role: dto.role },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });
    return toDeveloperMemberDto(updated);
  }

  async removeMember(
    userId: string,
    developerId: string,
    memberId: string,
  ): Promise<{ id: string }> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    const target = await this.getMemberOrThrow(developerId, memberId);

    // A member may remove themselves (leave); otherwise OWNER/MANAGER only.
    const isSelf = target.userId === userId;
    if (!isSelf) {
      this.assertRole(membership.role, MANAGER_ROLES);
    }

    if (target.role === DeveloperMemberRole.OWNER) {
      await this.assertNotLastOwner(developerId, memberId);
    }

    await this.prisma.developerMember.delete({ where: { id: memberId } });
    return { id: memberId };
  }

  async listCompounds(userId: string, developerId: string): Promise<AdminCompoundDto[]> {
    await this.getDeveloperOrThrow(developerId);
    await this.getMembershipOrThrow(userId, developerId);

    const compounds = await this.prisma.compound.findMany({
      where: { developerId },
      orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
    });
    return compounds.map((row) => toAdminCompound(row, 0));
  }

  async createCompound(
    userId: string,
    developerId: string,
    dto: CreateMemberCompoundDto,
  ): Promise<AdminCompoundDto> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    this.assertRole(membership.role, MANAGER_ROLES);

    await this.assertSlugAvailableForCompound(dto.slug);
    await this.assertActiveArea(dto.areaId);

    try {
      const created = await this.prisma.compound.create({
        data: {
          slug: dto.slug,
          areaId: dto.areaId,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          description: dto.description?.trim() || null,
          developerId,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
          coverUrl: dto.coverUrl ?? null,
          coverPublicId: dto.coverPublicId ?? null,
        },
      });
      return toAdminCompound(created, 0);
    } catch (error) {
      this.rethrowDuplicateCompoundSlug(error);
      throw error;
    }
  }

  async updateCompound(
    userId: string,
    developerId: string,
    compoundId: string,
    dto: UpdateMemberCompoundDto,
  ): Promise<AdminCompoundDto> {
    await this.getDeveloperOrThrow(developerId);
    const membership = await this.getMembershipOrThrow(userId, developerId);
    this.assertRole(membership.role, MANAGER_ROLES);

    const compound = await this.prisma.compound.findFirst({
      where: { id: compoundId, developerId },
    });
    if (!compound) {
      throw new NotFoundException('Compound not found under this developer account');
    }

    if (dto.slug !== undefined) {
      await this.assertSlugAvailableForCompound(dto.slug, compoundId);
    }
    if (dto.areaId !== undefined) {
      await this.assertActiveArea(dto.areaId);
    }

    const data: Prisma.CompoundUpdateInput = {};
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.areaId !== undefined) data.area = { connect: { id: dto.areaId } };
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.description !== undefined) data.description = dto.description?.trim() || null;
    if (dto.latitude !== undefined) data.latitude = dto.latitude;
    if (dto.longitude !== undefined) data.longitude = dto.longitude;
    if (dto.coverUrl !== undefined) data.coverUrl = dto.coverUrl;
    if (dto.coverPublicId !== undefined) data.coverPublicId = dto.coverPublicId;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.compound.update({
        where: { id: compoundId },
        data,
      });
      return toAdminCompound(updated, 0);
    } catch (error) {
      this.rethrowDuplicateCompoundSlug(error);
      throw error;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async getDeveloperOrThrow(developerId: string) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) {
      throw new NotFoundException('Developer account not found');
    }
    return developer;
  }

  private async getMembershipOrThrow(userId: string, developerId: string) {
    const membership = await this.prisma.developerMember.findUnique({
      where: { developerId_userId: { developerId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('Not a member of this developer account');
    }
    return membership;
  }

  private async getMemberOrThrow(developerId: string, memberId: string) {
    const member = await this.prisma.developerMember.findFirst({
      where: { id: memberId, developerId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  private assertRole(role: DeveloperMemberRole, allowed: DeveloperMemberRole[]): void {
    if (!allowed.includes(role)) {
      throw new ForbiddenException('Insufficient developer account role');
    }
  }

  private async assertNotLastOwner(developerId: string, excludingMemberId: string): Promise<void> {
    const ownerCount = await this.prisma.developerMember.count({
      where: { developerId, role: DeveloperMemberRole.OWNER },
    });
    const target = await this.prisma.developerMember.findUnique({
      where: { id: excludingMemberId },
    });
    if (ownerCount <= 1 && target?.role === DeveloperMemberRole.OWNER) {
      throw new BadRequestException(
        'Assign another owner before removing or demoting the last owner',
      );
    }
  }

  private async assertActiveArea(areaId: string): Promise<void> {
    const area = await this.prisma.area.findFirst({
      where: { id: areaId, isActive: true },
      select: { id: true },
    });
    if (!area) {
      throw new BadRequestException('Area not found or inactive');
    }
  }

  private async assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.developer.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Developer account slug already exists');
    }
  }

  private async assertSlugAvailableForCompound(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.compound.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Compound slug already exists');
    }
  }

  private rethrowDuplicateSlug(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BadRequestException('Developer account slug already exists');
    }
  }

  private rethrowDuplicateCompoundSlug(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BadRequestException('Compound slug already exists');
    }
  }
}
