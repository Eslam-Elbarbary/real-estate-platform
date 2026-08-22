'use client';

import type { ReactNode } from 'react';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  dataKindOptions,
  inquiryTypeOptions,
  periodOptions,
  projectKindOptions,
  propertyKindOptions,
  researchCopy,
  researchFieldLabels,
  studyKindOptions,
  timelineOptions,
  usageTypeOptions,
} from '../config';
import {
  researchRequestSchema,
  type ResearchRequestValues,
} from '../schemas';
import type { ResearchRequestType } from '../types';
import { ResearchRequestSuccess } from './research-request-success';

interface ResearchRequestFormProps {
  type: ResearchRequestType;
}

const fieldClass =
  'h-11 w-full rounded-md border border-[#d0d0d0] bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200';

function defaultValues(type: ResearchRequestType): ResearchRequestValues {
  const common = {
    name: '',
    company: '',
    email: '',
    phone: '',
    jobTitle: '',
    city: '',
  };
  if (type === 'trends-report') {
    return { type, ...common, usageType: '', notes: '' };
  }
  if (type === 'market-impact-report') {
    return { type, ...common, sector: '', region: '', purpose: '', notes: '' };
  }
  if (type === 'price-data') {
    return {
      type,
      ...common,
      city: '',
      areas: '',
      propertyKind: '',
      dataKinds: [],
      period: '',
    };
  }
  if (type === 'custom-study') {
    return {
      type,
      ...common,
      projectName: '',
      targetArea: '',
      projectKind: '',
      studyKinds: [],
      needDescription: '',
      timeline: '',
    };
  }
  return { type: 'contact', ...common, inquiryType: '', message: '' };
}

export function ResearchRequestForm({ type }: ResearchRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ResearchRequestValues>({
    resolver: zodResolver(researchRequestSchema),
    defaultValues: defaultValues(type),
  });

  function onSubmit(_values: ResearchRequestValues) {
    void _values;
  }

  if (isSubmitSuccessful) {
    return <ResearchRequestSuccess />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
      data-testid="research-request-form"
    >
      <input type="hidden" {...register('type')} />

      <Field id="res-name" label={researchFieldLabels.name} error={errors.name?.message}>
        <input id="res-name" autoComplete="name" className={fieldClass} aria-invalid={Boolean(errors.name)} {...register('name')} />
      </Field>
      <Field id="res-company" label={researchFieldLabels.company} error={errors.company?.message}>
        <input id="res-company" autoComplete="organization" className={fieldClass} aria-invalid={Boolean(errors.company)} {...register('company')} />
      </Field>
      <Field id="res-email" label={researchFieldLabels.email} error={errors.email?.message}>
        <input id="res-email" type="email" autoComplete="email" className={fieldClass} aria-invalid={Boolean(errors.email)} {...register('email')} />
      </Field>
      <Field id="res-phone" label={researchFieldLabels.phone} error={errors.phone?.message}>
        <input id="res-phone" type="tel" autoComplete="tel" className={fieldClass} aria-invalid={Boolean(errors.phone)} {...register('phone')} />
      </Field>
      <Field id="res-job" label={researchFieldLabels.jobTitle} error={errors.jobTitle?.message}>
        <input id="res-job" autoComplete="organization-title" className={fieldClass} aria-invalid={Boolean(errors.jobTitle)} {...register('jobTitle')} />
      </Field>

      {type !== 'price-data' ? (
        <Field id="res-city" label={researchFieldLabels.city} error={'city' in errors ? errors.city?.message : undefined}>
          <input id="res-city" className={fieldClass} {...register('city')} />
        </Field>
      ) : null}

      {type === 'trends-report' ? (
        <>
          <RadioGroup
            legend={researchFieldLabels.usageType}
            error={'usageType' in errors ? errors.usageType?.message : undefined}
            options={usageTypeOptions}
            name="usageType"
            register={register as UseFormRegister<ResearchRequestValues>}
          />
          <Field id="res-notes" label={researchFieldLabels.notes}>
            <textarea id="res-notes" rows={4} className={cn(fieldClass, 'h-auto py-2')} {...register('notes')} />
          </Field>
        </>
      ) : null}

      {type === 'market-impact-report' ? (
        <>
          <Field id="res-sector" label={researchFieldLabels.sector} error={'sector' in errors ? errors.sector?.message : undefined}>
            <input id="res-sector" className={fieldClass} {...register('sector')} />
          </Field>
          <Field id="res-region" label={researchFieldLabels.region} error={'region' in errors ? errors.region?.message : undefined}>
            <input id="res-region" className={fieldClass} {...register('region')} />
          </Field>
          <Field id="res-purpose" label={researchFieldLabels.purpose} error={'purpose' in errors ? errors.purpose?.message : undefined}>
            <input id="res-purpose" className={fieldClass} {...register('purpose')} />
          </Field>
          <Field id="res-notes-impact" label={researchFieldLabels.notes}>
            <textarea id="res-notes-impact" rows={4} className={cn(fieldClass, 'h-auto py-2')} {...register('notes')} />
          </Field>
        </>
      ) : null}

      {type === 'price-data' ? (
        <>
          <Field id="res-city-req" label={researchFieldLabels.city} error={'city' in errors ? errors.city?.message : undefined}>
            <input id="res-city-req" className={fieldClass} aria-invalid={Boolean('city' in errors && errors.city)} {...register('city')} />
          </Field>
          <Field id="res-areas" label={researchFieldLabels.areas} error={'areas' in errors ? errors.areas?.message : undefined}>
            <input id="res-areas" className={fieldClass} {...register('areas')} />
          </Field>
          <RadioGroup
            legend={researchFieldLabels.propertyKind}
            error={'propertyKind' in errors ? errors.propertyKind?.message : undefined}
            options={propertyKindOptions}
            name="propertyKind"
            register={register}
          />
          <CheckboxGroup
            legend={researchFieldLabels.dataKinds}
            error={'dataKinds' in errors ? errors.dataKinds?.message : undefined}
            options={dataKindOptions}
            name="dataKinds"
            register={register}
          />
          <RadioGroup
            legend={researchFieldLabels.period}
            error={'period' in errors ? errors.period?.message : undefined}
            options={periodOptions}
            name="period"
            register={register}
          />
        </>
      ) : null}

      {type === 'custom-study' ? (
        <>
          <Field id="res-project" label={researchFieldLabels.projectName} error={'projectName' in errors ? errors.projectName?.message : undefined}>
            <input id="res-project" className={fieldClass} {...register('projectName')} />
          </Field>
          <Field id="res-target" label={researchFieldLabels.targetArea} error={'targetArea' in errors ? errors.targetArea?.message : undefined}>
            <input id="res-target" className={fieldClass} {...register('targetArea')} />
          </Field>
          <RadioGroup
            legend={researchFieldLabels.projectKind}
            error={'projectKind' in errors ? errors.projectKind?.message : undefined}
            options={projectKindOptions}
            name="projectKind"
            register={register}
          />
          <CheckboxGroup
            legend={researchFieldLabels.studyKinds}
            error={'studyKinds' in errors ? errors.studyKinds?.message : undefined}
            options={studyKindOptions}
            name="studyKinds"
            register={register}
          />
          <Field
            id="res-need"
            label={researchFieldLabels.needDescription}
            error={'needDescription' in errors ? errors.needDescription?.message : undefined}
          >
            <textarea
              id="res-need"
              rows={5}
              className={cn(fieldClass, 'h-auto py-2')}
              aria-invalid={Boolean('needDescription' in errors && errors.needDescription)}
              {...register('needDescription')}
            />
          </Field>
          <RadioGroup
            legend={researchFieldLabels.timeline}
            error={'timeline' in errors ? errors.timeline?.message : undefined}
            options={timelineOptions}
            name="timeline"
            register={register}
          />
        </>
      ) : null}

      {type === 'contact' ? (
        <>
          <RadioGroup
            legend={researchFieldLabels.inquiryType}
            error={'inquiryType' in errors ? errors.inquiryType?.message : undefined}
            options={inquiryTypeOptions}
            name="inquiryType"
            register={register}
          />
          <Field id="res-message" label={researchFieldLabels.message} error={'message' in errors ? errors.message?.message : undefined}>
            <textarea id="res-message" rows={5} className={cn(fieldClass, 'h-auto py-2')} {...register('message')} />
          </Field>
        </>
      ) : null}

      <button
        type="submit"
        className={getButtonClassName({
          variant: 'primary',
          size: 'large',
          className: 'mt-2 w-full rounded-full sm:w-auto sm:min-w-44',
        })}
      >
        {researchCopy.submit}
      </button>
      <p className="text-xs text-ink-400">{researchCopy.demoDisclaimer}</p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-800">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RadioGroup({
  legend,
  error,
  options,
  name,
  register,
}: {
  legend: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  name: string;
  register: UseFormRegister<ResearchRequestValues>;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink-800">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 text-sm text-ink-700">
            <input
              type="radio"
              value={option.value}
              className="size-4 accent-brand-600"
              {...register(name as never)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function CheckboxGroup({
  legend,
  error,
  options,
  name,
  register,
}: {
  legend: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  name: 'dataKinds' | 'studyKinds';
  register: ReturnType<typeof useForm<ResearchRequestValues>>['register'];
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink-800">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              value={option.value}
              className="size-4 accent-brand-600"
              {...register(name as never)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
