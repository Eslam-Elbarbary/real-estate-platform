import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'eslam@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password1!' })
  @IsString()
  @MinLength(1)
  password!: string;
}
