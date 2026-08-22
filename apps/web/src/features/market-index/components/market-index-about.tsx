import { marketIndexCopy } from '../config';

export function MarketIndexAbout() {
  return (
    <div className="space-y-8">
      <section aria-labelledby="market-index-about-heading">
        <h2
          id="market-index-about-heading"
          className="text-sm font-extrabold text-ink-950"
        >
          {marketIndexCopy.aboutHeading}
        </h2>
        <div className="mt-2 space-y-2 text-[13px] leading-6 text-ink-600">
          {marketIndexCopy.aboutBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="market-index-howto-heading">
        <h2
          id="market-index-howto-heading"
          className="text-sm font-extrabold text-ink-950"
        >
          {marketIndexCopy.howToHeading}
        </h2>
        <ul className="mt-2 space-y-3">
          {marketIndexCopy.howToItems.map((item) => (
            <li key={item.title}>
              <p className="text-[13px] font-bold text-ink-800">{item.title}</p>
              <p className="text-[13px] leading-6 text-ink-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
