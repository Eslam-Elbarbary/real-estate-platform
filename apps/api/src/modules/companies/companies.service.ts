import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompanyMemberRole,
  Prisma,
} from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { AddCompanyMemberDto } from './dto/add-company-member.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyMemberDto } from './dto/update-company-member.dto';
import {
  CompanyDto,
  CompanyMemberDto,
  CompanyMembershipDto,
  toCompanyDto,
  toCompanyMemberDto,
  toCompanyMembershipDto,
} from './mapper/company.mapper';

/** Roles allowed to manage company profile/members, but not delete the company or grant OWNER. */
const MANAGER_ROLES: CompanyMemberRole[] = [
  CompanyMemberRole.OWNER,
  CompanyMemberRole.ADMIN,
];

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto): Promise<CompanyDto> {
    await this.assertSlugAvailable(dto.slug);

    try {
      const company = await this.prisma.company.create({
        data: {
          slug: dto.slug,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() || null,
          description: dto.description?.trim() || null,
          phone: dto.phone?.trim() || null,
          email: dto.email?.trim() || null,
          website: dto.website?.trim() || null,
          logoUrl: dto.logoUrl?.trim() || null,
          members: {
            create: { userId, role: CompanyMemberRole.OWNER },
          },
        },
      });
      return toCompanyDto(company);
    } catch (error) {
      this.rethrowDuplicateSlug(error);
      throw error;
    }
  }

  async listMine(userId: string): Promise<CompanyMembershipDto[]> {
    const memberships = await this.prisma.companyMember.findMany({
      where: { userId },
      include: { company: true },
      orderBy: { createdAt: 'asc' },
    });
    return memberships.map((row) => toCompanyMembershipDto(row.company, row.role));
  }

  async getById(userId: string, companyId: string): Promise<CompanyDto> {
    const company = await this.getCompanyOrThrow(companyId);
    await this.getMembershipOrThrow(userId, companyId);
    return toCompanyDto(company);
  }

  async update(
    userId: string,
    companyId: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    await this.getCompanyOrThrow(companyId);
    const membership = await this.getMembershipOrThrow(userId, companyId);
    this.assertRole(membership.role, MANAGER_ROLES);

    if (dto.slug !== undefined) {
      await this.assertSlugAvailable(dto.slug, companyId);
    }

    const data: Prisma.CompanyUpdateInput = {};
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn.trim();
    if (dto.nameAr !== undefined) data.nameAr = dto.nameAr?.trim() || null;
    if (dto.description !== undefined) data.description = dto.description?.trim() || null;
    if (dto.phone !== undefined) data.phone = dto.phone?.trim() || null;
    if (dto.email !== undefined) data.email = dto.email?.trim() || null;
    if (dto.website !== undefined) data.website = dto.website?.trim() || null;
    if (dto.logoUrl !== undefined) data.logoUrl = dto.logoUrl?.trim() || null;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.company.update({
        where: { id: companyId },
        data,
      });
      return toCompanyDto(updated);
    } catch (error) {
      this.rethrowDuplicateSlug(error);
      throw error;
    }
  }

  async remove(userId: string, companyId: string): Promise<{ id: string }> {
    await this.getCompanyOrThrow(companyId);
    const membership = await this.getMembershipOrThrow(userId, companyId);
    this.assertRole(membership.role, [CompanyMemberRole.OWNER]);

    await this.prisma.company.delete({ where: { id: companyId } });
    return { id: companyId };
  }

  async listMembers(userId: string, companyId: string): Promise<CompanyMemberDto[]> {
    await this.getCompanyOrThrow(companyId);
    await this.getMembershipOrThrow(userId, companyId);

    const members = await this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return members.map(toCompanyMemberDto);
  }

  async addMember(
    userId: string,
    companyId: string,
    dto: AddCompanyMemberDto,
  ): Promise<CompanyMemberDto> {
    await this.getCompanyOrThrow(companyId);
    const membership = await this.getMembershipOrThrow(userId, companyId);
    this.assertRole(membership.role, MANAGER_ROLES);

    const role = dto.role ?? CompanyMemberRole.AGENT;
    if (role === CompanyMemberRole.OWNER && membership.role !== CompanyMemberRole.OWNER) {
      throw new ForbiddenException('Only an OWNER can grant the OWNER role');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!targetUser) {
      throw new NotFoundException('No registered user with that email');
    }

    const existing = await this.prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId: targetUser.id } },
    });
    if (existing) {
      throw new BadRequestException('User is already a member of this company');
    }

    const created = await this.prisma.companyMember.create({
      data: { companyId, userId: targetUser.id, role },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });
    return toCompanyMemberDto(created);
  }

  async updateMemberRole(
    userId: string,
    companyId: string,
    memberId: string,
    dto: UpdateCompanyMemberDto,
  ): Promise<CompanyMemberDto> {
    await this.getCompanyOrThrow(companyId);
    const membership = await this.getMembershipOrThrow(userId, companyId);
    this.assertRole(membership.role, [CompanyMemberRole.OWNER]);

    const target = await this.getMemberOrThrow(companyId, memberId);
    if (target.role === CompanyMemberRole.OWNER && dto.role !== CompanyMemberRole.OWNER) {
      await this.assertNotLastOwner(companyId, memberId);
    }

    const updated = await this.prisma.companyMember.update({
      where: { id: memberId },
      data: { role: dto.role },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });
    return toCompanyMemberDto(updated);
  }

  async removeMember(
    userId: string,
    companyId: string,
    memberId: string,
  ): Promise<{ id: string }> {
    await this.getCompanyOrThrow(companyId);
    const membership = await this.getMembershipOrThrow(userId, companyId);
    const target = await this.getMemberOrThrow(companyId, memberId);

    // A member may remove themselves (leave); otherwise OWNER/ADMIN only.
    const isSelf = target.userId === userId;
    if (!isSelf) {
      this.assertRole(membership.role, MANAGER_ROLES);
    }

    if (target.role === CompanyMemberRole.OWNER) {
      await this.assertNotLastOwner(companyId, memberId);
    }

    await this.prisma.companyMember.delete({ where: { id: memberId } });
    return { id: memberId };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async getCompanyOrThrow(companyId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  private async getMembershipOrThrow(userId: string, companyId: string) {
    const membership = await this.prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('Not a member of this company');
    }
    return membership;
  }

  private async getMemberOrThrow(companyId: string, memberId: string) {
    const member = await this.prisma.companyMember.findFirst({
      where: { id: memberId, companyId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  private assertRole(role: CompanyMemberRole, allowed: CompanyMemberRole[]): void {
    if (!allowed.includes(role)) {
      throw new ForbiddenException('Insufficient company role');
    }
  }

  private async assertNotLastOwner(companyId: string, excludingMemberId: string): Promise<void> {
    const ownerCount = await this.prisma.companyMember.count({
      where: { companyId, role: CompanyMemberRole.OWNER },
    });
    const target = await this.prisma.companyMember.findUnique({ where: { id: excludingMemberId } });
    if (ownerCount <= 1 && target?.role === CompanyMemberRole.OWNER) {
      throw new BadRequestException(
        'Assign another owner before removing or demoting the last owner',
      );
    }
  }

  private async assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.company.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Company slug already exists');
    }
  }

  private rethrowDuplicateSlug(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new BadRequestException('Company slug already exists');
    }
  }
}
