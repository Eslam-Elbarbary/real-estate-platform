import Link from 'next/link';
import { researchCopy, researchRequestHref } from '../config';

export function ResearchContactCta() {
  return (
    <section className="mt-16 bg-surface-50 py-12 text-center">
      <h2 className="text-lg font-extrabold text-ink-900">
        {researchCopy.contactHeading}
      </h2>
      <Link
        href={researchRequestHref('contact')}
        className="mt-5 inline-flex h-10 items-center rounded-full border border-brand-600 bg-white px-6 text-sm font-bold text-brand-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {researchCopy.contactCta}
      </Link>
    </section>
  );
}
