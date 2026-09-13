import { Area, City, Country, District } from '@/prisma/generated/prisma-client';
import {
  AreaDto,
  AreaTreeNodeDto,
  CityDto,
  CityTreeNodeDto,
  CountryDto,
  CountryTreeNodeDto,
  DistrictDto,
} from './dto/location-response.dto';

type CountryWithTree = Country & {
  cities: Array<
    City & {
      areas: Array<Area & { districts: District[] }>;
    }
  >;
};

export function toCountryDto(country: Country): CountryDto {
  return {
    id: country.id,
    code: country.code,
    nameEn: country.nameEn,
    nameAr: country.nameAr,
  };
}

export function toCityDto(city: City): CityDto {
  return {
    id: city.id,
    countryId: city.countryId,
    slug: city.slug,
    nameEn: city.nameEn,
    nameAr: city.nameAr,
  };
}

export function toAreaDto(area: Area): AreaDto {
  return {
    id: area.id,
    cityId: area.cityId,
    slug: area.slug,
    nameEn: area.nameEn,
    nameAr: area.nameAr,
  };
}

export function toDistrictDto(district: District): DistrictDto {
  return {
    id: district.id,
    areaId: district.areaId,
    slug: district.slug,
    nameEn: district.nameEn,
    nameAr: district.nameAr,
  };
}

export function toLocationTree(countries: CountryWithTree[]): CountryTreeNodeDto[] {
  return countries.map((country) => ({
    ...toCountryDto(country),
    cities: country.cities.map(
      (city): CityTreeNodeDto => ({
        ...toCityDto(city),
        areas: city.areas.map(
          (area): AreaTreeNodeDto => ({
            ...toAreaDto(area),
            districts: area.districts.map(toDistrictDto),
          }),
        ),
      }),
    ),
  }));
}
