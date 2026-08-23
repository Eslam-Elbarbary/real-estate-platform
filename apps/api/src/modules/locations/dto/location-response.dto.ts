import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationNameDto {
  @ApiProperty({ example: 'Cairo' })
  nameEn!: string;

  @ApiPropertyOptional({ example: 'القاهرة', nullable: true })
  nameAr!: string | null;
}

export class CountryDto extends LocationNameDto {
  @ApiProperty({ example: 'clxcountryid' })
  id!: string;

  @ApiProperty({ example: 'EG' })
  code!: string;
}

export class CityDto extends LocationNameDto {
  @ApiProperty({ example: 'clxcityid' })
  id!: string;

  @ApiProperty({ example: 'clxcountryid' })
  countryId!: string;

  @ApiProperty({ example: 'cairo' })
  slug!: string;
}

export class AreaDto extends LocationNameDto {
  @ApiProperty({ example: 'clxareaid' })
  id!: string;

  @ApiProperty({ example: 'clxcityid' })
  cityId!: string;

  @ApiProperty({ example: 'nasr-city' })
  slug!: string;
}

export class DistrictDto extends LocationNameDto {
  @ApiProperty({ example: 'clxdistrictid' })
  id!: string;

  @ApiProperty({ example: 'clxareaid' })
  areaId!: string;

  @ApiProperty({ example: 'hay-el-sabaa' })
  slug!: string;
}

export class AreaTreeNodeDto extends AreaDto {
  @ApiProperty({ type: [DistrictDto] })
  districts!: DistrictDto[];
}

export class CityTreeNodeDto extends CityDto {
  @ApiProperty({ type: [AreaTreeNodeDto] })
  areas!: AreaTreeNodeDto[];
}

export class CountryTreeNodeDto extends CountryDto {
  @ApiProperty({ type: [CityTreeNodeDto] })
  cities!: CityTreeNodeDto[];
}
