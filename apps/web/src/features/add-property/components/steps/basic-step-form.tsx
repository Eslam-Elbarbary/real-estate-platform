'use client';

import { useMemo, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Home, KeyRound } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import type { LocationTreeCountry } from '@/types/api/public-property';
import type { PropertyType, TransactionType } from '@/types';
import { cn } from '@/lib/utils/cn';
import { saveBasicStepAction } from '../../actions';
import { listingCopy } from '../../config';
import type { ListingDraft } from '../../types';
import { ListingMapPicker } from '../listing-map-picker';
import {
  PropertyTypeCombobox,
  type CatalogPropertyTypeOption,
} from '../property-type-combobox';
import {
  PropertyLocationCascade,
  resolveHierarchyFromAreaId,
  type PropertyLocationCascadeValue,
} from '../property-location-cascade';

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

interface BasicStepFormProps {
  draft: ListingDraft;
  locationTree: LocationTreeCountry[];
  propertyTypeOptions: CatalogPropertyTypeOption[];
}

function initialLocation(
  draft: ListingDraft,
  tree: LocationTreeCountry[],
): PropertyLocationCascadeValue {
  const hierarchy = resolveHierarchyFromAreaId(
    tree,
    draft.areaId,
    draft.districtId,
  );
  return {
    countryId: draft.countryId || hierarchy.countryId,
    cityId: draft.cityId || hierarchy.cityId,
    areaId: draft.areaId || hierarchy.areaId,
    districtId: draft.districtId ?? hierarchy.districtId ?? null,
    compoundId: draft.compoundId ?? null,
    address: draft.address ?? draft.description.ar.address ?? '',
    latitude: draft.latitude ?? null,
    longitude: draft.longitude ?? null,
    locationLabel: draft.locationLabel || hierarchy.locationLabel || '',
  };
}

export function BasicStepForm({
  draft,
  locationTree,
  propertyTypeOptions,
}: BasicStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionType>(
    draft.transaction ?? 'sale',
  );
  const [propertyType, setPropertyType] = useState<PropertyType | null>(
    draft.propertyType,
  );
  const [location, setLocation] = useState<PropertyLocationCascadeValue>(() =>
    initialLocation(draft, locationTree),
  );
  const [latitude, setLatitude] = useState(
    draft.latitude ?? DEFAULT_LAT,
  );
  const [longitude, setLongitude] = useState(
    draft.longitude ?? DEFAULT_LNG,
  );

  const hasCoords = useMemo(
    () =>
      latitude != null &&
      longitude != null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude),
    [latitude, longitude],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveBasicStepAction(draft.id, {
        transaction,
        propertyType,
        countryId: location.countryId,
        cityId: location.cityId,
        areaId: location.areaId,
        districtId: location.districtId || null,
        compoundId: location.compoundId || null,
        address: location.address || null,
        locationLabel: location.locationLabel || '',
        latitude: hasCoords ? latitude : null,
        longitude: hasCoords ? longitude : null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink-800">
          {listingCopy.chooseSection}
        </legend>
        <div
          role="radiogroup"
          aria-label={listingCopy.chooseSection}
          className="grid grid-cols-2 gap-3"
        >
          <TransactionOption
            selected={transaction === 'sale'}
            onSelect={() => setTransaction('sale')}
            label={listingCopy.sale}
            icon={<Home className="size-5" aria-hidden />}
          />
          <TransactionOption
            selected={transaction === 'rent'}
            onSelect={() => setTransaction('rent')}
            label={listingCopy.rent}
            icon={<KeyRound className="size-5" aria-hidden />}
          />
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="listing-property-type"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {listingCopy.propertyType}
        </label>
        <PropertyTypeCombobox
          id="listing-property-type"
          value={propertyType}
          onChange={setPropertyType}
          options={propertyTypeOptions}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink-800">
          {listingCopy.location}
        </p>
        <PropertyLocationCascade
          tree={locationTree}
          value={location}
          onChange={setLocation}
          disabled={pending}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink-800">
          {listingCopy.mapTitle}
        </p>
        <ListingMapPicker
          latitude={latitude}
          longitude={longitude}
          onChange={({ latitude: lat, longitude: lng }) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
      </div>

      {error ? (
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={getButtonClassName({
          className: 'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
        })}
      >
        {listingCopy.continue}
      </button>
    </form>
  );
}

function TransactionOption({
  selected,
  onSelect,
  label,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        selected
          ? 'border-brand-500 bg-brand-50 text-brand-800'
          : 'border-[#d9d9d9] bg-white text-ink-700 hover:bg-surface-50',
      )}
    >
      <span className={selected ? 'text-brand-600' : 'text-ink-400'}>{icon}</span>
      {label}
    </button>
  );
}
