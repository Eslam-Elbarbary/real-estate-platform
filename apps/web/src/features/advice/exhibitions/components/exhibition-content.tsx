import Image from 'next/image';
import type { RealEstateExhibition } from '../types';

interface ExhibitionContentProps {
  exhibition: RealEstateExhibition;
}

export function ExhibitionContent({ exhibition }: ExhibitionContentProps) {
  return (
    <div className="mt-6">
      <div className="relative overflow-hidden bg-surface-50" data-testid="exhibition-branding">
        <span
          aria-hidden
          className="absolute start-0 top-0 z-10 h-full w-1.5 bg-accent-500"
        />
        <div className="relative mx-auto aspect-[16/7] w-full max-w-xl">
          <Image
            src={exhibition.coverImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 576px"
          />
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-8 text-ink-700">
        {exhibition.shortDescription}
      </p>

      <div className="mt-6 space-y-8">
        {exhibition.contentSections.map((section) => (
          <section key={section.id}>
            {section.heading ? (
              <h2 className="text-lg font-extrabold text-ink-950">{section.heading}</h2>
            ) : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-[15px] leading-8 text-ink-700">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
