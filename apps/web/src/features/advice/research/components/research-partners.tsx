import { researchCopy } from '../config';
import type { ResearchPartner } from '../types';

interface ResearchPartnersProps {
  partners: ResearchPartner[];
}

export function ResearchPartners({ partners }: ResearchPartnersProps) {
  return (
    <section className="mt-16" aria-labelledby="research-partners-heading">
      <h2
        id="research-partners-heading"
        className="text-center text-xl font-extrabold text-ink-800"
      >
        {researchCopy.partnersHeading}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-ink-500">
        {researchCopy.partnersIntro}
      </p>
      <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {partners.map((partner) => (
          <li key={partner.id}>
            <div className="flex h-20 items-center justify-center border border-[#ececec] bg-white px-3">
              <span className="text-sm font-extrabold tracking-wide text-ink-400">
                {partner.mark}
              </span>
              <span className="sr-only">{partner.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
