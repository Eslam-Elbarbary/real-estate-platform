import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetAdminCompanyActiveDto {
  @ApiProperty()
  @IsBoolean()
  isActive!: boolean;
}
