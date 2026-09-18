import type { MediaAsset } from '@/components/media-picker';
import type {
  FinishingType,
  PaymentType,
  RentPeriod,
} from '../../types';
import type { PropertyLocationValue } from '../property-location-field';

/** Admin property wizard step order (RTL labels). */
export const WIZARD_STEPS = [
  { id: 'basic', number: '01', title: 'البيانات الأساسية' },
  { id: 'pricing', number: '02', title: 'السعر والدفع' },
  { id: 'details', number: '03', title: 'تفاصيل العقار' },
  { id: 'location', number: '04', title: 'الموقع' },
  { id: 'features', number: '05', title: 'المميزات' },
  { id: 'contact', number: '06', title: 'التواصل' },
  { id: 'media', number: '07', title: 'الوسائط' },
  { id: 'review', number: '08', title: 'المراجعة' },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]['id'];

export interface PropertyWizardFormState {
  ownerId: string;
  title: string;
  referenceNumber: string;
  description: string;
  propertyTypeId: string;
  transactionTypeId: string;
  price: string;
  currency: string;
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  yearBuilt: string;
  furnished: boolean;
  rentPeriod: RentPeriod | '';
  paymentType: PaymentType | '';
  downPayment: string;
  installmentYears: string;
  monthlyInstallment: string;
  finishingType: FinishingType | '';
  propertyViewIds: string[];
  legalStatusId: string;
  compoundId: string;
  featureIds: string[];
}

export const EMPTY_WIZARD_FORM: PropertyWizardFormState = {
  ownerId: '',
  title: '',
  referenceNumber: '',
  description: '',
  propertyTypeId: '',
  transactionTypeId: '',
  price: '',
  currency: 'EGP',
  areaSqm: '',
  bedrooms: '',
  bathrooms: '',
  floor: '',
  yearBuilt: '',
  furnished: false,
  rentPeriod: '',
  paymentType: '',
  downPayment: '',
  installmentYears: '',
  monthlyInstallment: '',
  finishingType: '',
  propertyViewIds: [],
  legalStatusId: '',
  compoundId: '',
  featureIds: [],
};

export const EMPTY_WIZARD_LOCATION: PropertyLocationValue = {
  countryId: '',
  cityId: '',
  areaId: '',
  districtId: '',
  compoundId: '',
  countryName: '',
  cityName: '',
  areaName: '',
  districtName: '',
  compoundName: '',
  address: '',
  latitude: '',
  longitude: '',
};

export interface WizardStepErrors {
  ownerId?: string;
  title?: string;
  description?: string;
  propertyTypeId?: string;
  transactionTypeId?: string;
  price?: string;
  currency?: string;
  paymentType?: string;
  rentPeriod?: string;
  downPayment?: string;
  installmentYears?: string;
  monthlyInstallment?: string;
  areaSqm?: string;
  bedrooms?: string;
  bathrooms?: string;
  floor?: string;
  yearBuilt?: string;
  countryId?: string;
  cityId?: string;
  areaId?: string;
  latitude?: string;
  longitude?: string;
  images?: string;
}

export type WizardMediaState = {
  assets: MediaAsset[];
  primaryId: string | null;
};

export type WizardAutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function wizardStepIndex(stepId: WizardStepId): number {
  return WIZARD_STEPS.findIndex((step) => step.id === stepId);
}

export function isWizardStepId(value: string | null | undefined): value is WizardStepId {
  return WIZARD_STEPS.some((step) => step.id === value);
}

export function parseWizardStepIndex(
  value: string | null | undefined,
): number {
  if (!isWizardStepId(value)) {
    return 0;
  }
  const index = wizardStepIndex(value);
  return index >= 0 ? index : 0;
}
