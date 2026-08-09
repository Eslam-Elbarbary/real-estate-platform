'use server';

import { getValuationService } from './service';
import type { ValuationRequest, ValuationResult } from './types';

export async function createValuationAction(
  request: ValuationRequest,
): Promise<ValuationResult> {
  return getValuationService().create(request);
}
