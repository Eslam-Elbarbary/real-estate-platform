import { ApiProperty } from '@nestjs/swagger';
import type { UserRoleAssignment } from '../../permissions/user-roles.service';

export class AdminUserRoleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'MODERATOR' })
  code!: string;

  @ApiProperty({ example: 'Moderator' })
  name!: string;

  @ApiProperty()
  isSystem!: boolean;

  @ApiProperty()
  isAdmin!: boolean;

  @ApiProperty()
  isSuperAdmin!: boolean;

  @ApiProperty()
  assignedAt!: Date;
}

export function toAdminUserRole(assignment: UserRoleAssignment): AdminUserRoleDto {
  return {
    id: assignment.id,
    code: assignment.code,
    name: assignment.name,
    isSystem: assignment.isSystem,
    isAdmin: assignment.isAdmin,
    isSuperAdmin: assignment.isSuperAdmin,
    assignedAt: assignment.assignedAt,
  };
}
