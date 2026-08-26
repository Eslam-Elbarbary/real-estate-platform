import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({ example: 'Nasr City apartments under 3M' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiProperty({
    description: 'Saved search filter payload (opaque JSON)',
    example: { cityId: 'clxcity', priceMax: 3000000, bedrooms: 3 },
  })
  @IsObject()
  filters!: Record<string, unknown>;
}
