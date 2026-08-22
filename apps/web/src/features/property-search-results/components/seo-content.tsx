import Link from 'next/link';
import type { SearchSeoContent } from '../data/search-seo-content';

interface SeoContentProps {
  content: SearchSeoContent;
}

export function SeoContent({ content }: SeoContentProps) {
  return (
    <section className="border-t border-border bg-white pt-8 pb-10 sm:pt-10 sm:pb-12">
      <div className="space-y-7">
        <div>
          <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
            {content.heading}
          </h2>
          <p className="mt-3 max-w-5xl text-sm leading-7 text-ink-700 sm:text-[15px] sm:leading-8">
            {content.intro}
          </p>
        </div>

        {content.sections.map((section) => (
          <div key={section.heading} className="max-w-5xl">
            <h3 className="text-base font-bold text-ink-900 sm:text-lg">
              {section.heading}
            </h3>
            <div className="mt-2.5 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-sm leading-7 text-ink-700 sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-3">
          <LinkGroup title="عمليات بحث ذات صلة" links={content.searchLinks} />
          <LinkGroup title="مناطق هامة" links={content.locationLinks} />
          <LinkGroup title="روابط مقترحة" links={content.relatedLinks} />
        </div>
      </div>
    </section>
  );
}

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: SearchSeoContent['relatedLinks'];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-ink-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-brand-700 hover:text-brand-800 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
