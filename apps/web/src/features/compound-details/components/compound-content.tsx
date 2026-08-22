import { uiLabels } from '@/config/labels';
import type { CompoundContentSection } from '@/types';
import { cn } from '@/lib/utils/cn';

interface CompoundContentProps {
  sections: CompoundContentSection[];
  fallbackDescription?: string;
  className?: string;
}

export function CompoundContent({
  sections,
  fallbackDescription,
  className,
}: CompoundContentProps) {
  if (!sections.length && !fallbackDescription) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        {uiLabels.compoundDetailsContentTitle}
      </h2>

      <div className="mt-4 space-y-6 text-[14px] leading-7 text-ink-700">
        {sections.length
          ? sections.map((section, index) => (
              <div key={section.heading ?? `section-${index}`}>
                {section.heading ? (
                  <h3 className="mb-2 text-[15px] font-bold text-ink-900">
                    {section.heading}
                  </h3>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mt-2 first:mt-0">
                    {paragraph}
                  </p>
                ))}
                {section.listItems?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pe-5">
                    {section.listItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          : (
              <p>{fallbackDescription}</p>
            )}
      </div>
    </section>
  );
}
