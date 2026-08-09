'use client';

import { useCallback, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import type { LocationOption } from '@/features/locations';
import { createValuationAction } from '../actions';
import { valuationCopy } from '../config';
import type { ValuationDraft } from '../schemas';
import type { ValuationRequest } from '../types';
import { ValuationWizardShell } from './valuation-wizard-shell';
import { resolveWizardSteps } from '../wizard/steps';

interface ValuationWizardProps {
  locations: LocationOption[];
}

function toRequest(draft: ValuationDraft): ValuationRequest | null {
  if (
    !draft.goal ||
    !draft.location ||
    !draft.propertyType ||
    !draft.view ||
    !draft.finishing ||
    !draft.area
  ) {
    return null;
  }

  return {
    goal: draft.goal,
    location: draft.location,
    propertyType: draft.propertyType,
    view: draft.view,
    finishing: draft.finishing,
    area: draft.area,
    bedrooms: draft.bedrooms ?? 0,
    bathrooms: draft.bathrooms ?? 0,
    purchasePrice: draft.purchasePrice,
    purchaseDate: draft.purchaseDate,
    currentOwnerEstimate: draft.currentOwnerEstimate,
  };
}

export function ValuationWizard({ locations }: ValuationWizardProps) {
  const router = useRouter();
  const [draft, setDraftState] = useState<ValuationDraft>({
    bedrooms: 0,
    bathrooms: 0,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [pending, startTransition] = useTransition();
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const completedRef = useRef(false);

  const steps = useMemo(() => resolveWizardSteps(draft), [draft]);
  const safeIndex = Math.min(stepIndex, steps.length - 1);
  const current = steps[safeIndex];
  const StepComponent = current.component;
  const isAnalysis = current.id === 'analysis';
  const isCurrentEstimate = current.id === 'current-estimate';
  const canContinue = current.validate(draft);

  const setDraft = useCallback((patch: Partial<ValuationDraft>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
    if (patch.goal) {
      setStepIndex(0);
    }
  }, []);

  const persistAndGo = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const request = toRequest(draft);
    if (!request) {
      completedRef.current = false;
      return;
    }
    startTransition(async () => {
      const result = await createValuationAction(request);
      router.push(routes.valuation.report(result.id));
      router.refresh();
    });
  }, [draft, router]);

  const onAnalysisComplete = useCallback(() => {
    if (pending) return;
    persistAndGo();
  }, [pending, persistAndGo]);

  function goNext() {
    if (!canContinue) return;
    if (isCurrentEstimate) {
      setAnalysisStarted(true);
      setStepIndex((value) => value + 1);
      return;
    }
    if (current.id === 'details' && draft.goal === 'price-inquiry') {
      setAnalysisStarted(true);
      setStepIndex((value) => value + 1);
      return;
    }
    setStepIndex((value) => Math.min(value + 1, steps.length - 1));
  }

  function goPrevious() {
    setAnalysisStarted(false);
    completedRef.current = false;
    setStepIndex((value) => Math.max(value - 1, 0));
  }

  return (
    <ValuationWizardShell
      currentStep={stepIndex + 1}
      totalSteps={steps.length}
    >
      <StepComponent
        draft={draft}
        setDraft={setDraft}
        locations={locations}
        onAnalysisComplete={analysisStarted ? onAnalysisComplete : undefined}
      />

      {!isAnalysis ? (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={goPrevious}
            disabled={stepIndex === 0 || pending}
          >
            {valuationCopy.previous}
          </Button>
          <Button
            type="button"
            onClick={goNext}
            disabled={!canContinue || pending}
          >
            {isCurrentEstimate ||
            (current.id === 'details' && draft.goal === 'price-inquiry')
              ? valuationCopy.calculateCta
              : valuationCopy.next}
          </Button>
        </div>
      ) : null}
    </ValuationWizardShell>
  );
}
