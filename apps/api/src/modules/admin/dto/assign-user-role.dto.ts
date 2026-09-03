import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AssignUserRoleDto {
  @ApiProperty({
    example: 'MODERATOR',
    description: 'Uppercase role code to assign',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'roleCode must contain only uppercase letters, numbers, and underscores',
  })
  roleCode!: string;
}
