import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

type RoleWithCounts = Role & {
  _count?: {
    users: number;
    permissions: number;
  };
};

type RoleWithPermissions = Role & {
  permissions: Array<{ permission: { code: string } }>;
  _count?: {
    users: number;
    permissions: number;
  };
};

export class AdminRoleListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'MODERATOR' })
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  isSystem!: boolean;

  @ApiProperty()
  isAdmin!: boolean;

  @ApiProperty()
  isSuperAdmin!: boolean;

  @ApiProperty()
  priority!: number;

  @ApiProperty({ example: 3 })
  userCount!: number;

  @ApiProperty({ example: 5 })
  permissionCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AdminRoleDetailsDto extends AdminRoleListItemDto {
  @ApiProperty({ type: [String], example: ['properties.view', 'properties.approve'] })
  permissions!: string[];
}

export function toAdminRoleListItem(role: RoleWithCounts): AdminRoleListItemDto {
  return {
    id: role.id,
    code: role.code,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    isAdmin: role.isAdmin,
    isSuperAdmin: role.isSuperAdmin,
    priority: role.priority,
    userCount: role._count?.users ?? 0,
    permissionCount: role._count?.permissions ?? 0,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

export function toAdminRoleDetails(role: RoleWithPermissions): AdminRoleDetailsDto {
  return {
    ...toAdminRoleListItem(role),
    permissions: role.permissions
      .map((entry) => entry.permission.code)
      .sort(),
  };
}
