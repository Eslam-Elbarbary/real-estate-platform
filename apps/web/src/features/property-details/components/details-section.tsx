import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import type { Property } from '@/types';
import { buildDetailFields } from '../lib/detail-fields';

interface DetailsSectionProps {
  property: Property;
}

export function DetailsSection({ property }: DetailsSectionProps) {
  const fields = buildDetailFields(property);

  if (!fields.length) {
    return null;
  }

  return (
    <section id="details" className="scroll-mt-28 pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.detailsSectionTitle}
      </h2>

      <dl className="mt-5 overflow-hidden rounded-lg border border-border">
        <div className="grid sm:grid-cols-2">
          {fields.map((field, index) => {
            const row = Math.floor(index / 2);
            return (
              <div
                key={`${field.label}-${field.value}`}
                className={cn(
                  'flex min-h-[52px] items-center justify-between gap-4 border-b border-border px-5 py-3.5 sm:border-e',
                  row % 2 === 0 ? 'bg-surface-50' : 'bg-white',
                )}
              >
                <dt className="text-sm text-ink-500">{field.label}</dt>
                <dd className="text-sm font-semibold text-ink-900">
                  {field.value}
                </dd>
              </div>
            );
          })}
        </div>
      </dl>
    </section>
  );
}
