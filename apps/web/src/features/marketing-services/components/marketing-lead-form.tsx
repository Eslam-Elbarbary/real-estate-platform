'use client';

import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  marketingBusinessTypeOptions,
  marketingServicesCopy,
} from '../config';
import {
  marketingLeadSchema,
  type MarketingLeadFormValues,
} from '../schemas';

const fieldClass =
  'h-11 w-full rounded-md border border-[#d0d0d0] bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200';

export function MarketingLeadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<MarketingLeadFormValues>({
    resolver: zodResolver(marketingLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company: '',
      businessType: 'marketing_company',
      address: '',
    },
  });

  function onSubmit(_values: MarketingLeadFormValues) {
    // Demo only — future Express: POST /marketing-leads
    void _values;
  }

  if (isSubmitSuccessful) {
    return (
      <div
        id="marketing-lead-form"
        role="status"
        className="rounded-xl border border-success-700/20 bg-white px-5 py-10 text-center shadow-sm"
      >
        <p className="text-lg font-extrabold text-success-700">
          {marketingServicesCopy.formSuccess}
        </p>
        <p className="mt-2 text-sm text-ink-600">
          {marketingServicesCopy.formSuccessHint}
        </p>
      </div>
    );
  }

  return (
    <form
      id="marketing-lead-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-[#e5e5e5] bg-white p-5 shadow-sm sm:p-6"
      aria-label={marketingServicesCopy.formTitle}
    >
      <div className="space-y-3">
        <Field
          id="ms-name"
          label={marketingServicesCopy.formLabels.name}
          error={errors.name?.message}
        >
          <input
            id="ms-name"
            autoComplete="name"
            placeholder={marketingServicesCopy.formPlaceholders.name}
            aria-invalid={Boolean(errors.name)}
            className={fieldClass}
            {...register('name')}
          />
        </Field>

        <Field
          id="ms-company"
          label={marketingServicesCopy.formLabels.company}
          error={errors.company?.message}
        >
          <input
            id="ms-company"
            autoComplete="organization"
            placeholder={marketingServicesCopy.formPlaceholders.company}
            aria-invalid={Boolean(errors.company)}
            className={fieldClass}
            {...register('company')}
          />
        </Field>

        <Field
          id="ms-business-type"
          label={marketingServicesCopy.formLabels.businessType}
          error={errors.businessType?.message}
        >
          <select
            id="ms-business-type"
            aria-invalid={Boolean(errors.businessType)}
            className={cn(fieldClass, 'pe-8')}
            {...register('businessType')}
          >
            {marketingBusinessTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="ms-address"
          label={marketingServicesCopy.formLabels.address}
          error={errors.address?.message}
        >
          <input
            id="ms-address"
            autoComplete="street-address"
            placeholder={marketingServicesCopy.formPlaceholders.address}
            aria-invalid={Boolean(errors.address)}
            className={fieldClass}
            {...register('address')}
          />
        </Field>

        <Field
          id="ms-phone"
          label={marketingServicesCopy.formLabels.phone}
          error={errors.phone?.message}
        >
          <input
            id="ms-phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder={marketingServicesCopy.formPlaceholders.phone}
            aria-invalid={Boolean(errors.phone)}
            className={fieldClass}
            {...register('phone')}
          />
        </Field>

        <Field
          id="ms-email"
          label={marketingServicesCopy.formLabels.email}
          error={errors.email?.message}
        >
          <input
            id="ms-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder={marketingServicesCopy.formPlaceholders.email}
            aria-invalid={Boolean(errors.email)}
            className={fieldClass}
            {...register('email')}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={getButtonClassName({
          className: 'mt-5 h-11 w-full rounded-md font-bold',
        })}
      >
        {marketingServicesCopy.formSubmit}
      </button>
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
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-danger-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
