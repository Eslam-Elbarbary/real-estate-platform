import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Permission } from '@prisma/client';

export class AdminPermissionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'properties.view' })
  code!: string;

  @ApiProperty({ example: 'View Properties' })
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export function toAdminPermission(permission: Permission): AdminPermissionDto {
  return {
    id: permission.id,
    code: permission.code,
    name: permission.name,
    description: permission.description,
    createdAt: permission.createdAt,
  };
}
