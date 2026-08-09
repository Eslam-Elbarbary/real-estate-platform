import type { ComponentType } from 'react';
import type { LocationOption } from '@/features/locations';
import type { ValuationDraft } from '../schemas';
import type { ValuationGoal } from '../types';
import { GoalStep } from '../components/steps/goal-step';
import { LocationStep } from '../components/steps/location-step';
import { PropertyDetailsStep } from '../components/steps/property-details-step';
import { PurchaseDetailsStep } from '../components/steps/purchase-details-step';
import { CurrentEstimateStep } from '../components/steps/current-estimate-step';
import { AnalysisStep } from '../components/steps/analysis-step';

export interface ValuationStepContext {
  draft: ValuationDraft;
  setDraft: (patch: Partial<ValuationDraft>) => void;
  locations: LocationOption[];
  onCalculate?: () => void;
  onAnalysisComplete?: () => void;
}

export interface ValuationStepDefinition {
  id: string;
  title: string;
  component: ComponentType<ValuationStepContext>;
  validate: (draft: ValuationDraft) => boolean;
}

export function getValuationSteps(goal?: ValuationGoal): ValuationStepDefinition[] {
  const shared: ValuationStepDefinition[] = [
    {
      id: 'goal',
      title: 'الهدف',
      component: GoalStep,
      validate: (draft) => Boolean(draft.goal),
    },
    {
      id: 'location',
      title: 'الموقع',
      component: LocationStep,
      validate: (draft) => Boolean(draft.location?.slug && draft.location.name),
    },
    {
      id: 'details',
      title: 'التفاصيل',
      component: PropertyDetailsStep,
      validate: (draft) =>
        Boolean(
          draft.propertyType &&
            draft.view &&
            draft.finishing &&
            draft.area &&
            draft.area > 0 &&
            typeof draft.bedrooms === 'number' &&
            typeof draft.bathrooms === 'number',
        ),
    },
  ];

  if (goal === 'price-inquiry') {
    return [
      ...shared,
      {
        id: 'analysis',
        title: 'التحليل',
        component: AnalysisStep,
        validate: () => true,
      },
    ];
  }

  return [
    ...shared,
    {
      id: 'purchase',
      title: 'الشراء',
      component: PurchaseDetailsStep,
      validate: (draft) =>
        Boolean(draft.purchasePrice && draft.purchasePrice > 0 && draft.purchaseDate),
    },
    {
      id: 'current-estimate',
      title: 'التقدير الحالي',
      component: CurrentEstimateStep,
      validate: (draft) =>
        Boolean(draft.currentOwnerEstimate && draft.currentOwnerEstimate > 0),
    },
    {
      id: 'analysis',
      title: 'التحليل',
      component: AnalysisStep,
      validate: () => true,
    },
  ];
}

export function resolveWizardSteps(draft: ValuationDraft): ValuationStepDefinition[] {
  // Until a goal is chosen, use the longer owned flow length for progress UI.
  return getValuationSteps(draft.goal ?? 'owned-property');
}
