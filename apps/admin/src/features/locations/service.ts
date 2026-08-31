import {
  getAreas,
  getCities,
  getCountries,
  getDistricts,
  getTree,
} from './repository';
import type { Area, City, Country, District, LocationTreeNode } from './types';

export async function getAdminCountries(): Promise<Country[]> {
  return getCountries();
}

export async function getAdminCities(countryId: string): Promise<City[]> {
  return getCities(countryId);
}

export async function getAdminAreas(cityId: string): Promise<Area[]> {
  return getAreas(cityId);
}

export async function getAdminDistricts(areaId: string): Promise<District[]> {
  return getDistricts(areaId);
}

export async function getLocationTree(): Promise<LocationTreeNode[]> {
  return getTree();
}
