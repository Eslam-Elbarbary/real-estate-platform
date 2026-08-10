import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { valuationCopy } from '../../config';

export function ValuationReportActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={routes.valuation.portfolio}
        className={getButtonClassName({
          className: 'h-10 gap-2 px-4 text-sm font-bold',
        })}
        data-testid="report-portfolio-link"
      >
        {valuationCopy.portfolioAction}
      </Link>
      <Link
        href={routes.valuation.add}
        className={getButtonClassName({
          variant: 'outline',
          className: 'h-10 gap-2 border-brand-500 px-4 text-sm font-bold text-brand-700',
        })}
        data-testid="report-add-valuation-link"
      >
        {valuationCopy.addNew}
      </Link>
    </div>
  );
}
