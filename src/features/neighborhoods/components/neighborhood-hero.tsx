import Image from 'next/image';
import { neighborhoodCopy } from '../config';

interface NeighborhoodHeroProps {
  name: string;
  image: string;
}

export function NeighborhoodHero({ name, image }: NeighborhoodHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative aspect-[21/7] min-h-[180px] w-full sm:min-h-[220px]">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1180px"
        />
        <div className="absolute inset-0 bg-ink-950/35" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="rounded-md border border-white/80 bg-white/15 px-5 py-3 text-center backdrop-blur-[2px] sm:px-8 sm:py-4">
            <h1 className="text-lg font-extrabold text-white sm:text-2xl">
              {neighborhoodCopy.heroGuidePrefix} {name}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
