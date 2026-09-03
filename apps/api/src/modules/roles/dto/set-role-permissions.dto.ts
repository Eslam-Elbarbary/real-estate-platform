import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsString, MinLength } from 'class-validator';

export class SetRolePermissionsDto {
  @ApiProperty({
    type: [String],
    example: ['properties.view', 'properties.approve'],
    description: 'Permission codes to assign to the role (replaces existing mappings)',
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  permissionCodes!: string[];
}
