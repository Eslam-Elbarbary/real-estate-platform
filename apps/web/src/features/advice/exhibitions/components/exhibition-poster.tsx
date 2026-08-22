import Image from 'next/image';

interface ExhibitionPosterProps {
  src: string;
  title: string;
}

export function ExhibitionPoster({ src, title }: ExhibitionPosterProps) {
  return (
    <figure className="relative mt-10 aspect-[4/5] w-full overflow-hidden bg-surface-100 sm:aspect-[3/4]" data-testid="exhibition-poster">
      <Image
        src={src}
        alt={`ملصق ${title}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    </figure>
  );
}
