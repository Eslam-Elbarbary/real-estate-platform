import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  AreaDto,
  CityDto,
  CountryDto,
  CountryTreeNodeDto,
  DistrictDto,
} from './dto/location-response.dto';
import {
  toAreaDto,
  toCityDto,
  toCountryDto,
  toDistrictDto,
  toLocationTree,
} from './locations.mapper';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCountries(): Promise<CountryDto[]> {
    const countries = await this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return countries.map(toCountryDto);
  }

  async getCitiesByCountry(countryId: string): Promise<CityDto[]> {
    await this.assertActiveCountry(countryId);

    const cities = await this.prisma.city.findMany({
      where: { countryId, isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return cities.map(toCityDto);
  }

  async getAreasByCity(cityId: string): Promise<AreaDto[]> {
    await this.assertActiveCity(cityId);

    const areas = await this.prisma.area.findMany({
      where: { cityId, isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return areas.map(toAreaDto);
  }

  async getDistrictsByArea(areaId: string): Promise<DistrictDto[]> {
    await this.assertActiveArea(areaId);

    const districts = await this.prisma.district.findMany({
      where: { areaId, isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return districts.map(toDistrictDto);
  }

  async getTree(): Promise<CountryTreeNodeDto[]> {
    const countries = await this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
      include: {
        cities: {
          where: { isActive: true },
          orderBy: { nameEn: 'asc' },
          include: {
            areas: {
              where: { isActive: true },
              orderBy: { nameEn: 'asc' },
              include: {
                districts: {
                  where: { isActive: true },
                  orderBy: { nameEn: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    return toLocationTree(countries);
  }

  private async assertActiveCountry(countryId: string): Promise<void> {
    const country = await this.prisma.country.findFirst({
      where: { id: countryId, isActive: true },
      select: { id: true },
    });
    if (!country) {
      throw new NotFoundException('Country not found');
    }
  }

  private async assertActiveCity(cityId: string): Promise<void> {
    const city = await this.prisma.city.findFirst({
      where: { id: cityId, isActive: true },
      select: { id: true },
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }
  }

  private async assertActiveArea(areaId: string): Promise<void> {
    const area = await this.prisma.area.findFirst({
      where: { id: areaId, isActive: true },
      select: { id: true },
    });
    if (!area) {
      throw new NotFoundException('Area not found');
    }
  }
}
