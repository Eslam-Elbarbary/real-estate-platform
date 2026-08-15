import Image from 'next/image';
import { researchCopy } from '../config';

export function ResearchHero() {
  return (
    <section className="relative isolate h-[360px] overflow-hidden sm:h-[400px] lg:h-[420px]">
      <Image
        src="/assets/valuation/analysis.webp"
        alt={researchCopy.heroImageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-white/72" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="max-w-3xl text-2xl font-extrabold leading-snug text-brand-700 sm:text-3xl lg:text-[2.15rem]">
          {researchCopy.heroTitle}
        </p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-ink-800 sm:text-base">
          {researchCopy.heroSubtitle}
        </p>
        <a
          href="#research-services"
          className="mt-6 inline-flex h-10 items-center rounded-full border border-brand-600 bg-white px-6 text-sm font-bold text-brand-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {researchCopy.heroCta}
        </a>
      </div>
    </section>
  );
}
