import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Lead,
  LeadStatus,
  LeadType,
  Property,
  User,
} from '@prisma/client';

export class AdminLeadUserDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiProperty()
  email!: string;
}

export class AdminLeadPropertyDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiProperty()
  slug!: string;
}

export class AdminLeadDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: LeadType })
  type!: LeadType;

  @ApiProperty({ enum: LeadStatus })
  status!: LeadStatus;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ type: AdminLeadUserDto })
  buyer!: AdminLeadUserDto;

  @ApiProperty({ type: AdminLeadUserDto })
  seller!: AdminLeadUserDto;

  @ApiProperty({ type: AdminLeadPropertyDto })
  property!: AdminLeadPropertyDto;
}

type AdminLeadUserSource = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName'
>;

type AdminLeadPropertySource = Pick<Property, 'id' | 'title' | 'slug'>;

export type AdminLeadSource = Lead & {
  buyer: AdminLeadUserSource;
  seller: AdminLeadUserSource;
  property: AdminLeadPropertySource;
};

export const ADMIN_LEAD_INCLUDE = {
  buyer: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  seller: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  property: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
} as const;

function toUserDto(user: AdminLeadUserSource): AdminLeadUserDto {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null;
  return {
    id: user.id,
    name,
    email: user.email,
  };
}

export function toAdminLead(lead: AdminLeadSource): AdminLeadDto {
  return {
    id: lead.id,
    type: lead.type,
    status: lead.status,
    message: lead.message,
    phone: lead.phone,
    email: lead.email,
    createdAt: lead.createdAt.toISOString(),
    buyer: toUserDto(lead.buyer),
    seller: toUserDto(lead.seller),
    property: {
      id: lead.property.id,
      title: lead.property.title,
      slug: lead.property.slug,
    },
  };
}
