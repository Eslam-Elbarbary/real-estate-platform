import { researchRequestTypeSchema } from './schemas';
import type { ResearchRequestType } from './types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseResearchRequestType(
  searchParams: SearchParamsInput,
): ResearchRequestType | null {
  const parsed = researchRequestTypeSchema.safeParse(firstValue(searchParams.type));
  return parsed.success ? parsed.data : null;
}
