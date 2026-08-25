import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'clxplanid', description: 'Active plan id' })
  @IsString()
  @IsNotEmpty()
  planId!: string;
}
