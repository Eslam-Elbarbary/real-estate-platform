import { Container } from '@/components/ui/container';
import { valuationCopy } from '../../config';
import type { ValuationMarketAnalysis, ValuationResult } from '../../types';
import { InvestmentReturnSection } from './investment-return-section';
import { MarketValueComparison } from './market-value-comparison';
import { ValuationMarketAnalysisSection } from './valuation-market-analysis';
import { ValuationReportActions } from './valuation-report-actions';
import { ValuationReportSummary } from './valuation-report-summary';

interface OwnedPropertyValuationReportProps {
  result: ValuationResult;
  marketAnalysis: ValuationMarketAnalysis;
}

export function OwnedPropertyValuationReport({
  result,
  marketAnalysis,
}: OwnedPropertyValuationReportProps) {
  const purchasePrice = result.request.purchasePrice;

  return (
    <div className="bg-[#f7f8fa] pb-16" data-testid="owned-property-report">
      <Container className="py-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">
            {valuationCopy.reportTitle}
          </h1>
          <ValuationReportActions />
        </div>

        <div className="mt-6">
          <ValuationReportSummary result={result} />
        </div>

        <InvestmentReturnSection result={result} />

        {purchasePrice != null ? (
          <MarketValueComparison
            purchasePrice={purchasePrice}
            currentValue={result.estimatedPrice}
          />
        ) : null}

        <ValuationMarketAnalysisSection analysis={marketAnalysis} />
      </Container>
    </div>
  );
}
