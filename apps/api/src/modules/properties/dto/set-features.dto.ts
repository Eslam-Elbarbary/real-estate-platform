import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class SetFeaturesDto {
  @ApiProperty({
    type: [String],
    example: ['featureId1', 'featureId2'],
    description: 'Full replacement set of feature ids',
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  featureIds!: string[];
}
