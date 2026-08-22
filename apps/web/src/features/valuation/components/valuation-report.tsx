import type { Property } from '@/types';
import { buildMockValuationMarketAnalysis } from '../lib/market-analysis';
import type { ValuationResult } from '../types';
import { OwnedPropertyValuationReport } from './report/owned-property-valuation-report';
import { PriceInquiryValuationReport } from './report/price-inquiry-valuation-report';

interface ValuationReportProps {
  result: ValuationResult;
  related: Property[];
}

/** Goal-aware report router — keeps a single /valuation/report/[id] route. */
export function ValuationReport({ result, related }: ValuationReportProps) {
  if (result.request.goal === 'owned-property') {
    const marketAnalysis = buildMockValuationMarketAnalysis(
      result.request,
      result,
    );
    return (
      <OwnedPropertyValuationReport
        result={result}
        marketAnalysis={marketAnalysis}
      />
    );
  }

  return <PriceInquiryValuationReport result={result} related={related} />;
}
