import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleCode, User } from '@prisma/client';

export class AdminUserListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  isEmailVerified!: boolean;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ enum: RoleCode, isArray: true })
  roles!: RoleCode[];

  @ApiProperty()
  createdAt!: string;
}

export class AdminUserDetailsDto extends AdminUserListItemDto {
  @ApiProperty()
  updatedAt!: string;
}

export type SafeUserWithRoles = Pick<
  User,
  | 'id'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'avatarUrl'
  | 'isEmailVerified'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
> & {
  roles: Array<{ role: { code: RoleCode } }>;
};

function toDisplayName(user: Pick<User, 'firstName' | 'lastName'>): string | null {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || null;
}

export function toAdminUserListItem(user: SafeUserWithRoles): AdminUserListItemDto {
  return {
    id: user.id,
    email: user.email,
    name: toDisplayName(user),
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    roles: user.roles.map((entry) => entry.role.code),
    createdAt: user.createdAt.toISOString(),
  };
}

export function toAdminUserDetails(user: SafeUserWithRoles): AdminUserDetailsDto {
  return {
    ...toAdminUserListItem(user),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const ADMIN_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  isEmailVerified: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    select: {
      role: {
        select: { code: true },
      },
    },
  },
} as const;
