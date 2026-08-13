import { exhibitionCopy } from '../config';
import type { RealEstateExhibition } from '../types';
import { ExhibitionCard } from './exhibition-card';

interface RelatedExhibitionsProps {
  exhibitions: RealEstateExhibition[];
}

export function RelatedExhibitions({ exhibitions }: RelatedExhibitionsProps) {
  if (exhibitions.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="related-exhibitions-heading">
      <h2
        id="related-exhibitions-heading"
        className="text-xl font-extrabold text-ink-950"
      >
        {exhibitionCopy.relatedHeading}
      </h2>
      <div className="mt-2">
        {exhibitions.map((item) => (
          <ExhibitionCard key={item.id} exhibition={item} />
        ))}
      </div>
    </section>
  );
}
